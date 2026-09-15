import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";
import ts from "typescript";

// Real Zustand persistence with isolated in-memory storage, never user storage.
const require = createRequire(import.meta.url);
const code = ts.transpileModule(readFileSync(new URL("../src/store/useFavoriteStore.ts", import.meta.url), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
function load(state) {
  const memory = new Map();
  if (state !== undefined) memory.set("wongok-favorites", JSON.stringify({ state, version: 0 }));
  globalThis.localStorage = {
    getItem: (key) => memory.get(key) ?? null,
    setItem: (key, value) => memory.set(key, value),
    removeItem: (key) => memory.delete(key),
  };
  globalThis.window = { localStorage: globalThis.localStorage };
  const testModule = { exports: {} };
  vm.runInNewContext(code, { module: testModule, exports: testModule.exports, require });
  return testModule.exports.useFavoriteStore;
}
try {
  for (const value of [undefined, null, {}, { ids: null }, { ids: "bad" }]) {
    const store = load(value);
    assert.equal(store.persist.hasHydrated(), true, `hydration failed: ${JSON.stringify(value)}`);
    assert.equal(store.getState().ids.length, 0);
  }
  const store = load({ ids: ["batavia", "batavia", 4, null, "", "rak-thai"], toggle: "broken" });
  assert.equal(JSON.stringify(store.getState().ids), JSON.stringify(["batavia", "rak-thai"]));
  assert.equal(typeof store.getState().toggle, "function");
  store.getState().add("batavia");
  assert.equal(store.getState().ids.length, 2);
  store.getState().toggle("rak-thai");
  assert.equal(store.getState().has("rak-thai"), false);
  store.getState().add("rak-thai");
  store.getState().remove("batavia");
  assert.equal(JSON.stringify(store.getState().ids), '["rak-thai"]');
  store.getState().clear();
  assert.equal(store.getState().ids.length, 0);
  console.log("PASS favorites: empty/corrupt storage, duplicate IDs, action integrity, add/toggle/remove/clear");
} finally {
  delete globalThis.localStorage;
  delete globalThis.window;
}
