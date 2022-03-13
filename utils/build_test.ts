import { createCargoConfig, getConfigTemplate } from "./build.ts";
import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.128.0/testing/asserts.ts";

Deno.test("getConfigTemplate should produce correctly indented string", () => {
  const expected =
    '[build]\n[target.aarch64-unknown-linux-musl]\nlinker = "test"\n';

  assertEquals(getConfigTemplate("test"), expected);
});

Deno.test("createCargoFile should create linux file at specified path", () => {
  const tempFile = Deno.makeTempFileSync();
  createCargoConfig(tempFile);

  if (Deno.build.os === "linux") {
    assertEquals(
      Deno.readTextFileSync(tempFile),
      '[build]\n[target.aarch64-unknown-linux-musl]\nlinker = "/usr/bin/lld"\n',
    );
  } else if (Deno.build.os === "darwin") {
    assertEquals(
      Deno.readTextFileSync(tempFile),
      '[build]\n[target.aarch64-unknown-linux-musl]\nlinker = "/opt/homebrew/opt/llvm/bin/lld"\n',
    );
  } else {
    assert(false);
  }
});
