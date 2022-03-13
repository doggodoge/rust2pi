async function isToolchainInstalled(): Promise<boolean> {
  const rustupProcess = Deno.run({
    cmd: [
      "rustup",
      "target",
      "list",
    ],
    stdout: "piped",
  });
  const decoder = new TextDecoder("utf-8");
  const output = await rustupProcess.output();
  return decoder.decode(output).split("\n").includes(
    "aarch64-unknown-linux-musl (installed)",
  );
}

function installToolchain(): Promise<Deno.ProcessStatus> {
  const installToolchainProcess = Deno.run({
    cmd: ["rustup", "target", "add", "aarch64-unknown-linux-musl"],
  });
  return installToolchainProcess.status();
}

export { installToolchain, isToolchainInstalled };
