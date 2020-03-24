export function getLayerAndModuleName(absolutePath, absoluteBasePath): [string, string] {

  if (!absolutePath)
    return [null, null];

  if (absolutePath.startsWith(absoluteBasePath)) {
    return absolutePath.substring(`${absoluteBasePath}\\`.length).split("\\").map(x => {
      if (!x) return null;
      return x.toLowerCase()
    });
  }

  return [null, null];
}