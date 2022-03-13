import { existsSync } from "https://deno.land/std@0.129.0/fs/exists.ts";

function isLLDInstalled() {
  const checkMacOS = (): boolean =>
    existsSync("/opt/homebrew/opt/llvm/bin/lld");
  const checkLinux = (): boolean => existsSync("/usr/bin/lld");
  return checkMacOS() || checkLinux();
}

export { isLLDInstalled };
