import { toUint8Array } from "https://deno.land/x/base64/mod.ts";

export interface Wasm {
  buffer: Uint8Array;
  memory: Uint8Array;
  exports: { [key: string]: any };
  lalloc: (size: number) => void;
}

export function loadWasm(): Wasm {
  const mod: Wasm = {} as Wasm;
  mod.buffer = toUint8Array(
    "AGFzbQEAAAABBgFgAn9/AAMCAQAFBQEBCpBOBxYCBm1lbW9yeQIACXNpcGhhc2gyNAAACt0IAdoIAgh+An9C9crNg9es27fzACECQu3ekfOWzNy35AAhA0Lh5JXz1uzZvOwAIQRC88rRy6eM2bL0ACEFQQgpAwAhB0EQKQMAIQggAa1COIYhBiABQQdxIQsgACABaiALayEKIAUgCIUhBSAEIAeFIQQgAyAIhSEDIAIgB4UhAgJAA0AgACAKRg0BIAApAwAhCSAFIAmFIQUgAiADfCECIANCDYkhAyADIAKFIQMgAkIgiSECIAQgBXwhBCAFQhCJIQUgBSAEhSEFIAIgBXwhAiAFQhWJIQUgBSAChSEFIAQgA3whBCADQhGJIQMgAyAEhSEDIARCIIkhBCACIAN8IQIgA0INiSEDIAMgAoUhAyACQiCJIQIgBCAFfCEEIAVCEIkhBSAFIASFIQUgAiAFfCECIAVCFYkhBSAFIAKFIQUgBCADfCEEIANCEYkhAyADIASFIQMgBEIgiSEEIAIgCYUhAiAAQQhqIQAMAAsLAkACQAJAAkACQAJAAkACQCALDgcHBgUEAwIBAAsgBiAAMQAGQjCGhCEGCyAGIAAxAAVCKIaEIQYLIAYgADEABEIghoQhBgsgBiAAMQADQhiGhCEGCyAGIAAxAAJCEIaEIQYLIAYgADEAAUIIhoQhBgsgBiAAMQAAhCEGCyAFIAaFIQUgAiADfCECIANCDYkhAyADIAKFIQMgAkIgiSECIAQgBXwhBCAFQhCJIQUgBSAEhSEFIAIgBXwhAiAFQhWJIQUgBSAChSEFIAQgA3whBCADQhGJIQMgAyAEhSEDIARCIIkhBCACIAN8IQIgA0INiSEDIAMgAoUhAyACQiCJIQIgBCAFfCEEIAVCEIkhBSAFIASFIQUgAiAFfCECIAVCFYkhBSAFIAKFIQUgBCADfCEEIANCEYkhAyADIASFIQMgBEIgiSEEIAIgBoUhAiAEQv8BhSEEIAIgA3whAiADQg2JIQMgAyAChSEDIAJCIIkhAiAEIAV8IQQgBUIQiSEFIAUgBIUhBSACIAV8IQIgBUIViSEFIAUgAoUhBSAEIAN8IQQgA0IRiSEDIAMgBIUhAyAEQiCJIQQgAiADfCECIANCDYkhAyADIAKFIQMgAkIgiSECIAQgBXwhBCAFQhCJIQUgBSAEhSEFIAIgBXwhAiAFQhWJIQUgBSAChSEFIAQgA3whBCADQhGJIQMgAyAEhSEDIARCIIkhBCACIAN8IQIgA0INiSEDIAMgAoUhAyACQiCJIQIgBCAFfCEEIAVCEIkhBSAFIASFIQUgAiAFfCECIAVCFYkhBSAFIAKFIQUgBCADfCEEIANCEYkhAyADIASFIQMgBEIgiSEEIAIgA3whAiADQg2JIQMgAyAChSEDIAJCIIkhAiAEIAV8IQQgBUIQiSEFIAUgBIUhBSACIAV8IQIgBUIViSEFIAUgAoUhBSAEIAN8IQQgA0IRiSEDIAMgBIUhAyAEQiCJIQRBACACIAMgBCAFhYWFNwMACw=="
  );
  mod.exports = new WebAssembly.Instance(
    new WebAssembly.Module(mod.buffer)
  ).exports;
  mod.memory = new Uint8Array(mod.exports.memory.buffer);
  mod.lalloc = (bytes: number): void => {
    if (mod.memory.byteLength < bytes) {
      const pages: number = Math.ceil((bytes - mod.memory.byteLength) / 65536);
      mod.exports.memory.grow(pages);
      mod.memory = new Uint8Array(mod.exports.memory.buffer);
    }
  };
  return mod;
}