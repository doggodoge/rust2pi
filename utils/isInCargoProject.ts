async function isInCargoProject(workingDir?: string): Promise<boolean> {
  const cargoProcess = Deno.run({
    cwd: workingDir ?? Deno.cwd(),
    cmd: ["cargo", "verify-project"],
    stdout: "piped",
  });
  const decoder = new TextDecoder("utf-8");
  const output = await cargoProcess.output();
  console.log(decoder.decode(output));
  return decoder.decode(output) === '{"success":"true"}\n';
}

export { isInCargoProject };
