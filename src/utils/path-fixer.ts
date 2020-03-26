import path from "path"
import fs from "fs"

export function relativeToTilde(absoluteBasePath: string, absoluteCurrentPath: string, importPath: string): string {
  if (importPath.startsWith("~")) {
    return importPath
  }

  if (!absoluteCurrentPath.toLowerCase().startsWith(absoluteBasePath.toLowerCase())) {
    return importPath
  }

  const absoluteImportPath = getAbsolutePath(absoluteBasePath, absoluteCurrentPath, importPath)
  const tildePath = `~${absoluteImportPath.substring(absoluteBasePath.length)}`
  return path.normalize(tildePath).replace(/\\/g, '/')
}

export function tildeToRelative(absoluteBasePath: string, absoluteCurrentPath: string, importPath: string): string {
  if (!importPath.startsWith("~")) {
    return importPath
  }

  if (!absoluteCurrentPath.toLowerCase().startsWith(absoluteBasePath.toLowerCase())) {
    return importPath
  }

  const absoluteImportPath = getAbsolutePath(absoluteBasePath, absoluteCurrentPath, importPath)
  let relativePath = path.relative(absoluteCurrentPath, absoluteImportPath)
  relativePath = path.normalize(relativePath).replace(/\\/g, '/')

  if (relativePath.startsWith("..")) {
    return relativePath;
  }

  return `./${relativePath}`
}

export function getAbsolutePath(absoluteBasePath: string, absoluteCurrentPath: string, importPath: string): string {
  let absolutePath: string

  if (importPath.startsWith("~")) {
    absolutePath = path.join(absoluteBasePath, importPath.substring(1))
  } else {
    absolutePath = path.resolve(absoluteCurrentPath, importPath)
  }

  return path.normalize(absolutePath)
}

export function resolveAliasPath(absoluteBasePath: string, alias: {[key: string]: string}, pathToResolve: string): string {
  if (!alias) {
    return null
  }

  for (const key of Object.keys(alias)) {
    if (pathToResolve.startsWith(key)) {
      let aliasPath = alias[key]
      if (!path.isAbsolute(aliasPath)) {
        aliasPath = path.join(absoluteBasePath, aliasPath)
      }

      return path.join(aliasPath, pathToResolve.substring(key.length))
    }
  }

  return null
}

export function resolve(absoluteBasePath: string, absoluteCurrentPath: string, alias: {[key: string]: string}, pathToResolve: string): { path: string, found: boolean } {
  let resolvedPath = resolveAliasPath(absoluteBasePath, alias, pathToResolve)
  if (!resolvedPath) {
    resolvedPath = getAbsolutePath(absoluteBasePath, absoluteCurrentPath, pathToResolve)
  }

  if (fs.existsSync(resolvedPath) || fs.existsSync(`${resolvedPath}.scss`)) {
    return { path: resolvedPath, found: true}
  }

  return { path: resolvedPath, found: false }
}