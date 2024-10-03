import { glob } from "glob"
import { execSync } from "child_process"

const testFiles = glob.sync('src/**/*.test.ts')

if (testFiles.length > 0) {
  const files = testFiles.join(" ")
  execSync(`node --loader ts-node/esm --test ${files}`, { stdio: 'inherit' })
} else {
  console.log("No test files found.")
}