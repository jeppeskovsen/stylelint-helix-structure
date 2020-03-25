import path from "path"

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