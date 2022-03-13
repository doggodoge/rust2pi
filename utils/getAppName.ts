import { parse } from "https://deno.land/std@0.129.0/encoding/toml.ts";

type CargoToml = {
  package?: {
    name?: string;
  };
};

function getAppName(cargoPath: string): string | undefined {
  const output = Deno.readTextFileSync(cargoPath);
  const cargoToml: CargoToml = parse(output);
  return cargoToml?.package?.name;
}

export { getAppName };
