import { testRule } from "../utils/testing"
import { ruleName, messages } from "./restricted-tilde-imports"

testRule({
  ruleName,
  config: [true, { basePath: "./tests/files" }],
  fix: true,
  
  accept: [
    {
      code: `@import "~/foundation/BaseBanner"`,
      codeFilename: "./tests/files/feature/AwesomeBanner/index.scss",
      description: "Should work"
    },
    {
      code: `@import "./Subfolder/Subfile"`,
      codeFilename: "./tests/files/feature/AwesomeBanner/index.scss",
      description: "Should work"
    }
  ],

  reject: [
    {
      code: `@import "~/feature/AwesomeBanner/Subfolder/Subfile"`,
      fixed: `@import "./Subfolder/Subfile"`,
      codeFilename: "./tests/files/feature/AwesomeBanner/index.scss",
      description: "Should not work",
      message: messages.useRelativeImports({ 
        importPath: "~/feature/AwesomeBanner/Subfolder/Subfile",
        moduleName: "awesomebanner"
      }),
      line: 1,
      column: 1
    },
    {
      code: `@import "../../foundation/BaseBanner"`,
      fixed: `@import "~/foundation/BaseBanner"`,
      codeFilename: "./tests/files/feature/SuperBanner/index.scss",
      description: "Should not work",
      message: messages.useTildeImports({ 
        importPath: "../../foundation/BaseBanner",
        importLayerName: "foundation",
        currentLayerName: "feature"
      }),
      line: 1,
      column: 1
    },

    {
      code: `@import "~/feature/AwesomeBanner/NotExist"`,
      fixed: `@import "~/feature/AwesomeBanner/NotExist"`,
      codeFilename: "./tests/files/feature/AwesomeBanner/index.scss",
      description: "Should not work",
      message: messages.useRelativeImports({ 
        importPath: "~/feature/AwesomeBanner/NotExist",
        moduleName: "awesomebanner"
      }),
      line: 1,
      column: 1
    },
    {
      code: `@import "../../foundation/NotExist"`,
      fixed: `@import "../../foundation/NotExist"`,
      codeFilename: "./tests/files/feature/SuperBanner/index.scss",
      description: "Should not work",
      message: messages.useTildeImports({ 
        importPath: "../../foundation/NotExist",
        importLayerName: "foundation",
        currentLayerName: "feature"
      }),
      line: 1,
      column: 1
    }
  ]
})