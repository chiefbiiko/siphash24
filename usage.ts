import { siphash24 } from "https://denopkg.com/chiefbiiko/siphash24/mod.ts";

const enc: TextEncoder = new TextEncoder();

const msg: Uint8Array = enc.encode("untrusted msg from a MIB"); // x-byte msg
const key: Uint8Array = enc.encode("deadbeefdeadbeef"); // 16-byte key
const out: Uint8Array = new Uint8Array(8); // 8-byte mac

siphash24(msg, key, out);

console.log(`msg: ${msg}\nkey: ${key}\nmac: ${out}`);