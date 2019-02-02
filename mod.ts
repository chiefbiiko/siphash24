interface _bigint {
  l: number;
  h: number;
}

function _add(a: _bigint, b: _bigint): void {
  const rl: number = a.l + b.l;
  const a2: _bigint = { h: (a.h + b.h + ((rl / 2) >>> 31)) >>> 0, l: rl >>> 0 };
  a.h = a2.h;
  a.l = a2.l;
}

function _xor(a: _bigint, b: _bigint): void {
  a.h ^= b.h;
  a.h >>>= 0;
  a.l ^= b.l;
  a.l >>>= 0;
}

function _rotl(a: _bigint, n: number): void {
  const a2: _bigint = {
    h: (a.h << n) | (a.l >>> (32 - n)),
    l: (a.l << n) | (a.h >>> (32 - n))
  };
  a.h = a2.h;
  a.l = a2.l;
}

function _rotl32(a: _bigint): void {
  const al: number = a.l;
  a.l = a.h;
  a.h = al;
}

function _compress(v0: _bigint, v1: _bigint, v2: _bigint, v3: _bigint): void {
  _add(v0, v1);
  _add(v2, v3);
  _rotl(v1, 13);
  _rotl(v3, 16);
  _xor(v1, v0);
  _xor(v3, v2);
  _rotl32(v0);
  _add(v2, v1);
  _add(v0, v3);
  _rotl(v1, 17);
  _rotl(v3, 21);
  _xor(v1, v2);
  _xor(v3, v0);
  _rotl32(v2);
}

function _getuint32(a: Uint8Array, offset: number): number {
  return (
    (a[offset + 3] << 24) |
    (a[offset + 2] << 16) |
    (a[offset + 1] << 8) |
    a[offset]
  );
}

function _to4uint32s(a: Uint8Array): number[] {
  return [
    _getuint32(a, 0),
    _getuint32(a, 4),
    _getuint32(a, 8),
    _getuint32(a, 12)
  ];
}

function _8BytesBEfromBigintLE(h: _bigint, out: Uint8Array): void {
  const dv: DataView = new DataView(out.buffer);
  dv.setUint32(0, h.h, true); // offset, num, littleEndian
  dv.setUint32(4, h.l, true);
}

export function siphash24(
  msg: Uint8Array,
  key: Uint8Array,
  out: Uint8Array
): void {
  if (key.length !== 16) {
    throw TypeError("key.length is not 16 bytes");
  }
  if (out.length !== 8) {
    throw TypeError("out.length is not 8 bytes");
  }
  const k: number[] = _to4uint32s(key);
  const k0: _bigint = { h: k[1] >>> 0, l: k[0] >>> 0 };
  const k1: _bigint = { h: k[3] >>> 0, l: k[2] >>> 0 };
  const v0: _bigint = { h: k0.h, l: k0.l };
  const v2: _bigint = k0;
  const v1: _bigint = { h: k1.h, l: k1.l };
  const v3: _bigint = k1;
  let mi: _bigint;
  let mp: number = 0;
  const ml: number = msg.length;
  const ml7: number = ml - 7;
  const buf: Uint8Array = new Uint8Array(8);
  _xor(v0, { h: 0x736f6d65, l: 0x70736575 });
  _xor(v1, { h: 0x646f7261, l: 0x6e646f6d });
  _xor(v2, { h: 0x6c796765, l: 0x6e657261 });
  _xor(v3, { h: 0x74656462, l: 0x79746573 });
  while (mp < ml7) {
    mi = { h: _getuint32(msg, mp + 4), l: _getuint32(msg, mp) };
    _xor(v3, mi);
    _compress(v0, v1, v2, v3);
    _compress(v0, v1, v2, v3);
    _xor(v0, mi);
    mp += 8;
  }
  buf[7] = ml;
  let ic: number = 0;
  while (mp < ml) {
    buf[ic++] = msg[mp++];
  }
  while (ic < 7) {
    buf[ic++] = 0;
  }
  mi = {
    h: (buf[7] << 24) | (buf[6] << 16) | (buf[5] << 8) | buf[4],
    l: (buf[3] << 24) | (buf[2] << 16) | (buf[1] << 8) | buf[0]
  };
  _xor(v3, mi);
  _compress(v0, v1, v2, v3);
  _compress(v0, v1, v2, v3);
  _xor(v0, mi);
  _xor(v2, { h: 0, l: 0xff });
  _compress(v0, v1, v2, v3);
  _compress(v0, v1, v2, v3);
  _compress(v0, v1, v2, v3);
  _compress(v0, v1, v2, v3);
  const h: _bigint = v0;
  _xor(h, v1);
  _xor(h, v2);
  _xor(h, v3);
  _8BytesBEfromBigintLE(h, out);
}
