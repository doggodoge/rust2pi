import { bold, red } from "https://deno.land/std@0.129.0/fmt/colors.ts";

function printLLDNotInstalledMessage() {
  switch (Deno.build.os) {
    case "darwin":
      console.error(
        red(
          bold(
            "Please install llvm using homebrew. Do this with 'brew install llvm'.",
          ),
        ),
      );
      break;
    case "linux":
      console.error(
        red(bold("Please llvm and lld with your distros package manager.")),
      );
      break;
    case "windows":
      console.error(
        red(bold("Windows is not a supported platform. Consider using WSL.")),
      );
      break;
    default:
      console.error(red(bold("You are using an unsupported platform.")));
  }
}

export { printLLDNotInstalledMessage };
