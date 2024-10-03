import path from "path"
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { relativeToTilde, tildeToRelative } from "./path-fixer.js"

test("utils/path-fixer tests", async (t) => {
  const absoluteBasePath = "C:\\project\\src"

  await t.test("converts relative path to tilde", async () => {
    const currentPath = path.join(absoluteBasePath, "utils")
    
    const result1 = relativeToTilde(absoluteBasePath, currentPath, "../some-folder/some-file")
    const result2 = relativeToTilde(absoluteBasePath, currentPath, "./some-folder/some-file")
    
    assert.equal(result1, "~/some-folder/some-file")
    assert.equal(result2, "~/utils/some-folder/some-file")
  })

  await t.test("converts tilde path to relative", async () => {
    const importPath = "~/some-folder/some-file"
    
    const result1 = tildeToRelative(absoluteBasePath, path.join(absoluteBasePath, "utils"), importPath)
    const result2 = tildeToRelative(absoluteBasePath, absoluteBasePath, importPath)

    assert.equal(result1, "../some-folder/some-file")
    assert.equal(result2, "./some-folder/some-file")
  })
})