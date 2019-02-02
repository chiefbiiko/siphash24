export function parseTestVector(v: {
  key: number[];
  msg: number[];
  expected: number[];
}): { key: Uint8Array; msg: Uint8Array; expected: Uint8Array } {
  return {
    key: new Uint8Array(v.key),
    msg: new Uint8Array(v.msg),
    expected: new Uint8Array(v.expected)
  };
}
