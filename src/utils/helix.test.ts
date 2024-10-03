import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getLayerAndModuleName } from "./helix.js";

test("utils/helix tests", async (t) => {
  await t.test("returns correct layer and module", async () => {
    const [layer, module] = getLayerAndModuleName("C:\\test\\src\\feature\\Banner", "C:\\test\\src")
    
    assert.equal(layer, "feature");
    assert.equal(module, "banner");
  });

  await t.test("returns correct layer and module deep", async () => {
    const [layer, module] = getLayerAndModuleName("C:\\test\\src\\feature\\Banner\\subfolder\\subfolder\\subfolder\\subfolder", "C:\\test\\src")
    
    assert.equal(layer, "feature");
    assert.equal(module, "banner");
  });

  await t.test("returns null without breaking", async () => {
    const [layer, module] = getLayerAndModuleName("C:\\invalid path", "C\\invalid")

    assert.equal(layer, null);
    assert.equal(module, null);
  });
});