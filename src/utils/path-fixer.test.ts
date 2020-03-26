import path from "path"
import { relativeToTilde, tildeToRelative, getAbsolutePath, resolveAliasPath } from "./path-fixer"

describe("utils/path-fixer tests", () => {
  const absoluteBasePath = "C:\\project\\src"

  it("converts relative path to tilde", () => {
    const currentPath = path.join(absoluteBasePath, "utils")
    
    const result1 = relativeToTilde(absoluteBasePath, currentPath, "../some-folder/some-file")
    const result2 = relativeToTilde(absoluteBasePath, currentPath, "./some-folder/some-file")
    
    expect(result1).toBe("~/some-folder/some-file")
    expect(result2).toBe("~/utils/some-folder/some-file")
  })

  it("converts tilde path to relative", () => {
    const importPath = "~/some-folder/some-file"
    
    const result1 = tildeToRelative(absoluteBasePath, path.join(absoluteBasePath, "utils"), importPath)
    const result2 = tildeToRelative(absoluteBasePath, absoluteBasePath, importPath)

    expect(result1).toBe("../some-folder/some-file")
    expect(result2).toBe("./some-folder/some-file")
  })

  it("resolves absolute path", () => {
    const currentPath = path.join(absoluteBasePath, "utils")
    const expected = "C:\\project\\src\\some-folder\\some-file.js"

    const result1 = getAbsolutePath(absoluteBasePath, currentPath, "../some-folder/some-file.js")    
    const result2 = getAbsolutePath(absoluteBasePath, currentPath, "~/some-folder/some-file.js")

    expect(result1).toBe(expected)
    expect(result2).toBe(expected)
  })

  it("resolves alias paths", () => {
    const alias = {
      "~": "./",
      "@node_modules": "../node_modules"
    }

    const result1 = resolveAliasPath(absoluteBasePath, alias, "./some-folder/some-file.js")
    expect(result1).toBe(null)

    const result2 = resolveAliasPath(absoluteBasePath, alias, "../some-folder/some-file.js")
    expect(result2).toBe(null)

    const result3 = resolveAliasPath(absoluteBasePath, alias, "~/some-folder/some-file.js")
    expect(result3).toBe("C:\\project\\src\\some-folder\\some-file.js")

    const result4 = resolveAliasPath(absoluteBasePath, alias, "@node_modules/some-folder/some-file.js")
    expect(result4).toBe("C:\\project\\node_modules\\some-folder\\some-file.js")
  })
})