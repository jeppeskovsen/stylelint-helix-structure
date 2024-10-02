import path from "node:path"
import { testRule } from "stylelint-test-rule-node";
import { ruleName, messages } from "./restricted-imports.rule"

testRule({
  ruleName,
  config: [true, { basePath: "./tests/files" }],
  accept: [
    {
      code: `@import "../../foundation/BaseBanner"`,
      codeFilename: "./tests/files/feature/AwesomeBanner/index.scss",
      description: "Import foundation from feature"
    },
    {
      code: `@import "../../foundation/Utils"`,
      codeFilename: "./tests/files/foundation/BaseBanner/index.scss",
      description: "Import foundation from foundation"
    },
    {
      code: `@import "../../foundation/Utils"`,
      codeFilename: "./tests/files/project/Stylelint/index.scss",
      description: "Import foundation from project"
    },
    {
      code: `@import "../../feature/SuperBanner"`,
      codeFilename: "./tests/files/project/Stylelint/index.scss",
      description: "Import feature from project"
    },
    {
      code: `@import "./Subfolder/Subfile"`,
      codeFilename: "./tests/files/feature/AwesomeBanner/index.scss",
      description: "Import from feature same feature"
    },
    {
      code: `@import "./Subfolder/Subfile"`,
      codeFilename: "./tests/files/project/Stylelint/index.scss",
      description: "Import from same project"
    },
  ],

  reject: [
    {
      code: `@import "../SuperBanner"`,
      codeFilename: "./tests/files/feature/AwesomeBanner/index.scss",
      description: "Import from another feature",
      message: messages.featureIntoFeature({ 
        importPath: "../SuperBanner"
      }),
      line: 1,
      column: 1
    },
    {
      code: `@import "../../feature/SuperBanner"`,
      codeFilename: "./tests/files/foundation/BaseBanner/index.scss",
      description: "Import feature from foundation",
      message: messages.featureIntoFoundation({ 
        importPath: "../../feature/SuperBanner"
      }),
      line: 1,
      column: 1
    },
    {
      code: `@import "../../project/Stylelint"`,
      codeFilename: "./tests/files/foundation/BaseBanner/index.scss",
      description: "Import project from foundation",
      message: messages.projectIntoFoundation({ 
        importPath: "../../project/Stylelint"
      }),
      line: 1,
      column: 1
    },
    {
      code: `@import "../../project/Stylelint"`,
      codeFilename: "./tests/files/feature/AwesomeBanner/index.scss",
      description: "Import project from feature",
      message: messages.projectIntoFeature({ 
        importPath: "../../project/Stylelint"
      }),
      line: 1,
      column: 1
    },
    {
      code: `@import "../../project/Other"`,
      codeFilename: "./tests/files/project/Stylelint/index.scss",
      description: "Import from another project",
      message: messages.projectIntoProject({ 
        importPath: "../../project/Other"
      }),
      line: 1,
      column: 1
    },
    {
      code: `@import "../../foundation/NotExists"`,
      codeFilename: "./tests/files/feature/AwesomeBanner/index.scss",
      description: "Import non existing file",
      message: messages.noUnresolvedImports({ 
        importPath: "../../foundation/NotExists",
        absolutePath: path.resolve(__dirname, "../../", "tests/files/foundation/NotExists")
      }),
      line: 1,
      column: 1
    }
  ]
})