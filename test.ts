import { readFileSync } from "deno";
import { siphash24 } from "./mod.ts";
import { test, equal, runTests } from "https://deno.land/x/testing/mod.ts";

const testVectors = JSON.parse(
  new TextDecoder().decode(readFileSync("./test_vectors.json"))
).map(function parseTestVector(v: {
  key: number[];
  msg: number[];
  expected: number[];
}): { key: Uint8Array; msg: Uint8Array; expected: Uint8Array } {
  return {
    key: new Uint8Array(v.key),
    msg: new Uint8Array(v.msg),
    expected: new Uint8Array(v.expected)
  };
});

test(function passesTestVectors(): void {
  const out: Uint8Array = new Uint8Array(8);
  for (const testVector of testVectors) {
    siphash24(testVector.msg, testVector.key, out);
    equal(out, testVector.expected);
    out.fill(0);
  }
});

runTests();
