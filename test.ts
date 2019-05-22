import { siphash24 } from "./mod.ts";
import { test, runIfMain } from "https://deno.land/std/testing/mod.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

interface TestVector {
  key: Uint8Array;
  msg: Uint8Array;
  expected: Uint8Array;
}

// test vectors obtained from https://131002.net/siphash/siphash24.c
const testVectors: TestVector[] = JSON.parse(
  new TextDecoder().decode(Deno.readFileSync("./test_vectors.json"))
).map(({ key, msg, expected }: { [key: string]: number[] }): TestVector => ({
  key: Uint8Array.from(key),
  msg: Uint8Array.from(msg),
  expected: Uint8Array.from(expected)
}));

test(function passesTestVectors() {
  const out: Uint8Array = new Uint8Array(8);
  for (const { msg, key, expected } of testVectors) {
    siphash24(msg, key, out);
    assertEquals(out, expected);
    out.fill(0);
  }
});

runIfMain(import.meta);
