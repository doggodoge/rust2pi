import { getAppName } from "./getAppName.ts";
import { assertEquals } from "https://deno.land/std@0.129.0/testing/asserts.ts";

Deno.test("should read project name from Cargo.toml file", () => {
  assertEquals(getAppName("./utils/testdata/Cargo.mock.toml"), "simple-test");
});
