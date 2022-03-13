import { isInCargoProject } from "./isInCargoProject.ts";
import { assertEquals } from "https://deno.land/std@0.128.0/testing/asserts.ts";

Deno.test("should return true when in cargo project", () => {
  assertEquals(isInCargoProject("./testdata/mock-project/"), true);
});

Deno.test("should return false when not in cargo project", () => {
  assertEquals(isInCargoProject("./testdata/"), false);
});
