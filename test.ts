import { readFileSync } from "deno";
import { parseTestVector } from "./util.ts";
import { siphash24 } from "./mod.ts";
import { test, equal, runTests } from "https://deno.land/x/testing/mod.ts";

const testVectors = JSON.parse(
  new TextDecoder().decode(readFileSync("./test_vectors.json"))
).map(parseTestVector);

test(function passesTestVectors(): void {
  for (const testVector of testVectors) {
    equal(siphash24(testVector.key, testVector.msg), testVector.expected);
  }
});

runTests();
