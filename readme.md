# siphash24

[![Travis](http://img.shields.io/travis/chiefbiiko/siphash24.svg?style=flat)](http://travis-ci.org/chiefbiiko/siphash24) [![AppVeyor](https://ci.appveyor.com/api/projects/status/github/chiefbiiko/siphash24?branch=master&svg=true)](https://ci.appveyor.com/project/chiefbiiko/siphash24)

---

SipHash24 implemented in WebAssembly.

> Tailored to [`Deno`](https://github.com/denoland/deno)

All credit to the original authors [Jean-Philippe Aumasson](https://131002.net) and [Daniel J. Bernstein](http://cr.yp.to), as well as open-source contributors [jedisct1 (Frank Denis)](https://github.com/jedisct1/siphash-js), [mafintosh](https://github.com/mafintosh/siphash24-wasm) and [emilbayes](https://github.com/emilbayes/siphash24) for porting the reference implementation to JavaScript and WebAssembly.

---

## Import

```ts
import { siphash24 } from "https://denopkg.com/chiefbiiko/siphash24/mod.ts";
```

---

## Usage

``` ts
import { siphash24, BYTES } from "https://denopkg.com/chiefbiiko/siphash24/mod.ts";

const enc: TextEncoder = new TextEncoder();

const msg: Uint8Array = enc.encode("msg from a MIB"); // x-byte msg
const key: Uint8Array = enc.encode("deadbeefdeadbeef"); // 16-byte key
const mac: Uint8Array = new Uint8Array(BYTES); // 8-byte mac

siphash24(msg, key, mac);

console.log(`msg: ${msg}\nkey: ${key}\nmac: ${mac}`);
```

---

## API

#### `siphash24(msg:Uint8Array, key: Uint8Array, out: Uint8Array): void`

Mac a variable-length message with a 16-byte key while providing a 8-byte output buffer.

---

## See also

[Jean-Philippe Aumasson & Daniel J. Bernstein (2012-09-18). "SipHash: a fast short-input PRF".](https://131002.net/siphash/siphash.pdf)

[SipHash (2-4) implemented in pure Javascript and WebAssembly](https://github.com/mafintosh/siphash24)

---

## License

[MIT](./license.md)
