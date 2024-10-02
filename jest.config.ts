import { createDefaultPreset, JestConfigWithTsJest } from "ts-jest"

const jestConfig: JestConfigWithTsJest = {
  ...createDefaultPreset(),
  // preset: "ts-jest",
  // testEnvironment: "node",
  // transform: {
  //   "^.+.tsx?$": ["ts-jest", {}],
  // },
}

export default jestConfig

// /** @type {import('ts-jest').JestConfigWithTsJest} **/
// module.exports = {
//   testEnvironment: "node",
//   transform: {
//     "^.+.tsx?$": ["ts-jest",{}],
//   },
// };