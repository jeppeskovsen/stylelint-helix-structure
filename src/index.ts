import { createPlugin } from "stylelint"
import { namespace } from "./utils/namespace"

const rules = {
  "restricted-imports": require("./rules/restricted-imports").default,
  "restricted-tilde-imports": require("./rules/restricted-tilde-imports").default
}

export default Object.keys(rules).map(ruleName => {
  return createPlugin(namespace(ruleName), rules[ruleName]);
})