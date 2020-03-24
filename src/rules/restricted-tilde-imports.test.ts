import { testRule } from "../utils/testing"
import { ruleName, messages } from "./restricted-tilde-imports"

testRule({
  ruleName,
  config: [true, { basePath: "./tests/files" }],
  
  accept: [
    {
      code: `@import "./Subfolder/Subfile"`,
      codeFilename: "./tests/files/feature/AwesomeBanner/index.scss",
      description: "Should work"
    }
  ],

  reject: [
    {
      code: `@import "~/feature/AwesomeBanner/Subfile"`,
      codeFilename: "./tests/files/feature/AwesomeBanner/index.scss",
      description: "Should not work",
      message: messages.useRelativeImports({ 
        importPath: "~/feature/AwesomeBanner/Subfile",
        moduleName: "awesomebanner"
      }),
      line: 1,
      column: 1
    },
    {
      code: `@import "../../foundation/BaseBanner"`,
      codeFilename: "./tests/files/feature/SuperBanner/index.scss",
      description: "Should not work",
      message: messages.useTildeImports({ 
        importPath: "../../foundation/BaseBanner",
        importLayerName: "foundation",
        currentLayerName: "feature"
      }),
      line: 1,
      column: 1
    }
  ]
})