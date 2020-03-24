import { testRule } from "../utils/testing"
import { ruleName, messages } from "./restricted-imports"

testRule({
  ruleName,
  config: [true, { basePath: "./tests/files" }],
  
  accept: [
    {
      code: `@import "../../foundation/BaseBanner"`,
      codeFilename: "./tests/files/feature/AwesomeBanner/index.scss",
      description: "Should work"
    },
    {
      code: `@import "../../foundation/Utils"`,
      codeFilename: "./tests/files/foundation/BaseBanner/index.scss",
      description: "Should work"
    },
    {
      code: `@import "../../foundation/Utils"`,
      codeFilename: "./tests/files/project/Stylelint/index.scss",
      description: "Should work"
    },
    {
      code: `@import "../../feature/SuperBanner"`,
      codeFilename: "./tests/files/project/Stylelint/index.scss",
      description: "Should work"
    },
    {
      code: `@import "./Subfolder/Subfile"`,
      codeFilename: "./tests/files/feature/AwesomeBanner/index.scss",
      description: "Should work"
    },
  ],

  reject: [
    {
      code: `@import "../SuperBanner"`,
      codeFilename: "./tests/files/feature/AwesomeBanner/index.scss",
      description: "Should not work",
      message: messages.featureIntoFeature({ 
        importPath: "../SuperBanner",
        currentLayerName: "feature",
        importLayerName: "feature"
      }),
      line: 1,
      column: 1
    },
    {
      code: `@import "../../feature/SuperBanner"`,
      codeFilename: "./tests/files/foundation/AwesomeBanner/index.scss",
      description: "Should not work",
      message: messages.featureOrProjectIntoFoundation({ 
        importPath: "../../feature/SuperBanner",
        currentLayerName: "foundation",
        importLayerName: "feature"
      }),
      line: 1,
      column: 1
    },
    {
      code: `@import "../../project/Stylelint"`,
      codeFilename: "./tests/files/foundation/AwesomeBanner/index.scss",
      description: "Should not work",
      message: messages.featureOrProjectIntoFoundation({ 
        importPath: "../../project/Stylelint",
        currentLayerName: "foundation",
        importLayerName: "project"
      }),
      line: 1,
      column: 1
    },
  ]
})