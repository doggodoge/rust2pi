async function isInCargoProject(workingDir: string): Promise<boolean> {
  const cargoProcess = Deno.run({
    cwd: workingDir,
    cmd: ["cargo", "verify-project"],
    stdout: "piped",
  });
  const decoder = new TextDecoder("utf-8");
  const output = await cargoProcess.output();
  return decoder.decode(output) === '{"success":"true"}\n';
}

export { isInCargoProject };
