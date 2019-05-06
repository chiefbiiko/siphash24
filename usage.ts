import { siphash24, BYTES } from "https://denopkg.com/chiefbiiko/siphash24/mod.ts";

const enc: TextEncoder = new TextEncoder();

const msg: Uint8Array = enc.encode("msg from a MIB"); // x-byte msg
const key: Uint8Array = enc.encode("deadbeefdeadbeef"); // 16-byte key
const mac: Uint8Array = new Uint8Array(BYTES); // 8-byte mac

siphash24(msg, key, mac);

console.log(`msg: ${msg}\nkey: ${key}\nmac: ${mac}`);