import { testRule } from "../utils/testing"
import rule, { ruleName, messages } from "./restricted-imports"

testRule({
  ruleName,
  
  accept: [
    {
      codeFilename: "",
      code: `@import "../feature/AwesomeBanner"`,
      description: "do not import from another feature"
    }
  ]
})


// import postcss from "postcss";
// import rule, { ruleName, messages } from "./restricted-imports";

// // import rule from "./restricted-imports";
// // import { test, testFilePath } from "../utils/testing"


// function logError(err) {
//   console.log(err.stack); // eslint-disable-line no-console
// }

// testRule()

// ruleTester.run("restricted-imports", rule, {

//   valid: [
//     test({
//       code: 'import "../../foundation/BaseBanner"',
//       filename: testFilePath("./files/feature/AwesomeBanner/index.js"),
//       options: [{
//         basePath: "./tests/files"
//       }],
//     }),
//     test({
//       code: 'import "../../foundation/Utils"',
//       filename: testFilePath("./files/foundation/BaseBanner/index.js"),
//       options: [{
//         basePath: "./tests/files"
//       }],
//     }),
//     test({
//       code: 'import "../../foundation/Utils"',
//       filename: testFilePath("./files/Project/Eslint/index.js"),
//       options: [{
//         basePath: "./tests/files"
//       }],
//     }),
//     test({
//       code: 'import "../../feature/SuperBanner"',
//       filename: testFilePath("./files/Project/Eslint/index.js"),
//       options: [{
//         basePath: "./tests/files"
//       }],
//     }),
//     test({
//       code: 'import "./Subfolder/Subfile"',
//       filename: testFilePath("./files/feature/AwesomeBanner/index.js"),
//       options: [{
//         basePath: "./tests/files"
//       }],
//     }),
//   ],


//   invalid: [
//     test({
//       code: 'import "../SuperBanner"',
//       filename: testFilePath("./files/feature/AwesomeBanner/index.js"),
//       options: [{
//         basePath: "./tests/files"
//       }],
//       errors: [{
//         message: "Unexpected path '../SuperBanner'. Cannot import feature into a another feature.",
//         line: 1,
//         column: 8,
//       }]
//     }),
//     test({
//       code: 'import "../../feature/SuperBanner"\nimport "../../project/Eslint"',
//       filename: testFilePath("./files/foundation/AwesomeBanner/index.js"),
//       options: [{
//         basePath: "./tests/files"
//       }],
//       errors: [{
//         message: "Unexpected path '../../feature/SuperBanner'. Cannot import feature into foundation.",
//         line: 1,
//         column: 8,
//       }, {
//         message: "Unexpected path '../../project/Eslint'. Cannot import project into foundation.",
//         line: 2,
//         column: 8,
//       }]
//     }),
//   ]
// })