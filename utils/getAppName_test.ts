import { getAppName } from "./getAppName.ts";
import { assertEquals } from "https://deno.land/std@0.129.0/testing/asserts.ts";

Deno.test("Simple test", () => {
  const output = getAppName("./testdata/Cargo.mock.toml");
  assertEquals("simple-test", output);
});
