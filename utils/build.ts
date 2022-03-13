import { getAppName } from "./mod.ts";
import {
  ensureDirSync,
  existsSync,
} from "https://deno.land/std@0.128.0/fs/mod.ts";
import {
  bold,
  green,
  red,
  yellow,
} from "https://deno.land/std@0.128.0/fmt/colors.ts";

const getConfigTemplate = (linkerPath: string): string => {
  return `[build]
[target.aarch64-unknown-linux-musl]
linker = "${linkerPath}"
`;
};

function createCargoConfig(configPath: string) {
  console.log(
    yellow(
      bold("Adding config file to use cross platform linker from LLVM."),
    ),
  );
  const configPathDirOnly = configPath.split("/").slice(0, -1).join("/");
  ensureDirSync(configPathDirOnly);
  if (Deno.build.os === "darwin") {
    Deno.writeTextFileSync(
      configPath,
      getConfigTemplate("/opt/homebrew/opt/llvm/bin/lld"),
      { append: true },
    );
  } else if (Deno.build.os === "linux") {
    Deno.writeTextFileSync(configPath, getConfigTemplate("/usr/bin/lld"), {
      append: true,
    });
  }
}

function strip(binaryPath: string): Promise<Deno.ProcessStatus> {
  const stripProcess = Deno.run({
    cmd: ["llvm-strip", binaryPath],
  });
  return stripProcess.status();
}

function sync(
  appName: string,
  binaryPath: string,
  remote: string,
): Promise<Deno.ProcessStatus> {
  console.log(yellow(bold("Please enter the password for your Raspberry Pi.")));
  const syncProcess = Deno.run({
    cmd: ["rsync", binaryPath, `${remote}:~/${appName}`],
  });
  return syncProcess.status();
}

async function stripAndUpload(
  appName: string,
  appBinary: string,
  remote: string,
) {
  (await strip(appBinary)).success
    ? console.log(yellow(bold(`Stripped ${appName}`)))
    : console.error(red(bold(`Failed to strip ${appName}`)));
  (await sync(appName, appBinary, remote)).success ||
    console.log(red(bold(`Failed to upload ${appName}`)));
}

async function build(remote: string) {
  const configPath = "./.cargo/config.toml";
  const appName = getAppName("./Cargo.toml") ?? "app";
  const appBinary = `./target/aarch64-unknown-linux-musl/release/${appName}`;
  if (!existsSync(configPath)) {
    createCargoConfig(configPath);
  }
  const buildProcess = Deno.run({
    cmd: ["cargo", "build", "--release", "--target=aarch64-unknown-linux-musl"],
  });
  console.log(yellow(bold(`Building app ${appName}`)));
  if ((await buildProcess.status()).success) {
    await stripAndUpload(appName, appBinary, remote);
    console.log(green(bold(`Uploaded to ~/${appName} on pi@${remote}`)));
  } else {
    console.error(red(bold(`Failed to build app ${appName}`)));
  }
}

export { build, createCargoConfig, getConfigTemplate };
