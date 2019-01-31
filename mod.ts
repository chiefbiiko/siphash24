interface _bigint {
  l: number
  h: number
}

function _add(a: _bigint, b: _bigint): void {
    var rl: number = a.l + b.l,
        a2: _bigint = { h: a.h + b.h + (rl / 2 >>> 31) >>> 0,
               l: rl >>> 0 };
    a.h = a2.h; a.l = a2.l;
}

function _xor(a: _bigint, b: _bigint): void {
    a.h ^= b.h; a.h >>>= 0;
    a.l ^= b.l; a.l >>>= 0;
}

function _rotl(a: _bigint, n: number): void {
    var a2: _bigint = {
        h: a.h << n | a.l >>> (32 - n),
        l: a.l << n | a.h >>> (32 - n)
    };
    a.h = a2.h; a.l = a2.l;
}

function _rotl32(a: _bigint): void {
    var al: number = a.l;
    a.l = a.h; a.h = al;
}

function _compress(v0:_bigint, v1: _bigint, v2: _bigint, v3: _bigint): void {
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

function _get_uint32(a: Uint8Array, offset: number): number {
    return a[offset + 3] << 24 |
           a[offset + 2] << 16 |
           a[offset + 1] << 8 |
           a[offset];
}

function _to4uint32s(a: Uint8Array): number[] {
    return [_get_uint32(a, 0), _get_uint32(a, 4),
            _get_uint32(a, 8), _get_uint32(a, 12)];
}

function __hash_hex(key, m) {
    var r = siphash24(key, m);
    return ("0000000" + r.h.toString(16)).substr(-8) +
           ("0000000" + r.l.toString(16)).substr(-8);
}

// TODO: return Uint8Array
export function siphash24(key: Uint8Array, msg: Uint8Array): _bigint {
    let k: number[] = _to4uint32s(key);
    var k0: _bigint = { h: k[1] >>> 0, l: k[0] >>> 0 },
        k1: _bigint = { h: k[3] >>> 0, l: k[2] >>> 0 },
        v0: _bigint = { h: k0.h, l: k0.l }, v2:_bigint = k0,
        v1: _bigint = { h: k1.h, l: k1.l }, v3: _bigint = k1,
        mi: _bigint, mp: number = 0, ml: number = msg.length, ml7: number = ml - 7,
        buf: Uint8Array = new Uint8Array(new ArrayBuffer(8)); // rid

    _xor(v0, { h: 0x736f6d65, l: 0x70736575 });
    _xor(v1, { h: 0x646f7261, l: 0x6e646f6d });
    _xor(v2, { h: 0x6c796765, l: 0x6e657261 });
    _xor(v3, { h: 0x74656462, l: 0x79746573 });
    while (mp < ml7) {
        mi = { h: _get_uint32(msg, mp + 4), l: _get_uint32(msg, mp) };
        _xor(v3, mi);
        _compress(v0, v1, v2, v3);
        _compress(v0, v1, v2, v3);
        _xor(v0, mi);
        mp += 8;
    }
    buf[7] = ml;
    var ic: number = 0;
    while (mp < ml) {
        buf[ic++] = msg[mp++];
    }
    while (ic < 7) {
        buf[ic++] = 0;
    }
    mi = { h: buf[7] << 24 | buf[6] << 16 | buf[5] << 8 | buf[4],
           l: buf[3] << 24 | buf[2] << 16 | buf[1] << 8 | buf[0] };
    _xor(v3, mi);
    _compress(v0, v1, v2, v3);
    _compress(v0, v1, v2, v3);
    _xor(v0, mi);
    _xor(v2, { h: 0, l: 0xff });
    _compress(v0, v1, v2, v3);
    _compress(v0, v1, v2, v3);
    _compress(v0, v1, v2, v3);
    _compress(v0, v1, v2, v3);

    var h: _bigint = v0;
    _xor(h, v1);
    _xor(h, v2);
    _xor(h, v3);

    return h;
}
