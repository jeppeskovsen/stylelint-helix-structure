export function getLayerAndModuleName(absolutePath: string, absoluteBasePath: string): [string | null, string | null] {

  if (!absolutePath) {
    return [null, null]
  }

  if (absolutePath.startsWith(absoluteBasePath)) {
    return absolutePath.substring(`${absoluteBasePath}\\`.length).split("\\").map(x => {
      if (!x) return null;
      return x.toLowerCase()
    }) as [string | null, string | null];
  }

  return [null, null];
}