import { testRule } from "stylelint-test-rule-node";
import { ruleName, messages } from "./restricted-tilde-imports.rule"

testRule({
  ruleName,
  config: [true, { 
    basePath: "./tests/files",
  }],
  fix: true,
  accept: [
    {
      code: `@import "~/foundation/BaseBanner"`,
      codeFilename: "./tests/files/feature/AwesomeBanner/index.scss",
      description: "Tilde import foundation to feature"
    },
    {
      code: `@import "./Subfolder/Subfile"`,
      codeFilename: "./tests/files/feature/AwesomeBanner/index.scss",
      description: "Relative import from same feature"
    }
  ],

  reject: [
    {
      code: `@import "~/feature/AwesomeBanner/Subfolder/Subfile"`,
      fixed: `@import "./Subfolder/Subfile"`,
      codeFilename: "./tests/files/feature/AwesomeBanner/index.scss",
      description: "Tilde import to same feature",
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
      description: "Relative import foundation to feature",
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
      description: "Tilde import non existing file",
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
      description: "Relative import non existing file",
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