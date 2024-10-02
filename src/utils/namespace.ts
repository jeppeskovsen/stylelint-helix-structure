const prefix = "helix-structure";

export function namespace(ruleName: string) {
  return `${prefix}/${ruleName}`;
}