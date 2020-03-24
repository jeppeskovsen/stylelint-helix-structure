import debug from "debug"
const log = debug("ModuleCache")

export class ModuleCache {

  private map: Map<string, any>;

  constructor(map = null) {
    this.map = map || new Map()
  }

  public set(cacheKey: string, result) {
    this.map.set(cacheKey, { result, lastSeen: process.hrtime() })
    log('setting entry for', cacheKey)
    return result
  }

  public get(cacheKey: string, settings) {
    if (this.map.has(cacheKey)) {
      const f = this.map.get(cacheKey)
      // check fresness
      if (process.hrtime(f.lastSeen)[0] < settings.lifetime) return f.result
    } else log('cache miss for', cacheKey)
    // cache miss
    return undefined
  }

  public static getSettings() {
    const cacheSettings = {
      lifetime: 30,  // seconds
    }
  
    // parse infinity
    // if (cacheSettings.lifetime === '∞' || cacheSettings.lifetime === 'Infinity') {
    //   cacheSettings.lifetime = Infinity
    // }
  
    return cacheSettings
  }

}


