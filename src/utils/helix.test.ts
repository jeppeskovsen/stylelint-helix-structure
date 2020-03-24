import { getLayerAndModuleName } from "./helix";

describe("utils/helix tests", () => {
  it("returns correct layer and module", () => {
    const [layer, module] = getLayerAndModuleName("C:\\test\\src\\feature\\Banner", "C:\\test\\src")
    
    expect(layer).toBe("feature");
    expect(module).toBe("banner");
  });

  it("returns correct layer and module deep", () => {
    const [layer, module] = getLayerAndModuleName("C:\\test\\src\\feature\\Banner\\subfolder\\subfolder\\subfolder\\subfolder", "C:\\test\\src")
    
    expect(layer).toBe("feature");
    expect(module).toBe("banner");
  });

  it("returns null without breaking", () => {
    const [layer, module] = getLayerAndModuleName("C:\\invalid path", "C\\invalid")

    expect(layer).toBe(null);
    expect(module).toBe(null);
  });
});