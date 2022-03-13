import { bold, red, yellow } from "https://deno.land/std@0.129.0/fmt/colors.ts";
import {
  build,
  installToolchain,
  isInCargoProject,
  isLLDInstalled,
  isToolchainInstalled,
} from "./utils/mod.ts";

/** Build an arm64 linux binary and send it to a pi */
async function rust2pi() {
  const remote = Deno.args.at(1) ?? Deno.exit(1);

  const inCargoProject = await isInCargoProject(Deno.cwd());
  if (!inCargoProject) {
    console.error(red(bold("You are not in a cargo project.")));
    Deno.exit(1);
  }
  if (!isLLDInstalled()) {
    console.error(
      red(bold("Please install LLD from a package manager of your choice.")),
    );
    Deno.exit(1);
  }

  const hasToolchain = await isToolchainInstalled();
  if (!hasToolchain) {
    console.log(yellow(bold("Installing missing cross-toolchain for arm64")));
    const status = await installToolchain();
    if (status.success) {
      console.log(yellow(bold("Installed cross toolchain.")));
    }
  }

  build(remote);
}

await rust2pi();
