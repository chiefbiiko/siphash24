import { Wasm, loadWasm } from "./loadWasm.ts";
import { assert } from "https://deno.land/x/testing/asserts.ts";

const wasm: Wasm = loadWasm();

export const BYTES: number = 8;
export const KEYBYTES: number = 16;

export function siphash24(
  msg: Uint8Array,
  key: Uint8Array,
  out: Uint8Array
): void {
  assert(out.length === BYTES);
  assert(key.length === KEYBYTES);
  wasm.lalloc(msg.length + 24);
  wasm.memory.set(key, 8);
  wasm.memory.set(msg, 24);
  wasm.exports.siphash24(24, msg.length);
  wasm.memory.fill(0, 8, 24);
  out.set(wasm.memory.subarray(0, 8));
}