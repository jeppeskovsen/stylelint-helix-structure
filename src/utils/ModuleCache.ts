export class ModuleCache {

  private map: Map<string, any>;

  constructor(map = null) {
    this.map = map || new Map()
  }

  /**
   * returns value for returning inline
   * @param {[type]} cacheKey [description]
   * @param {[type]} result   [description]
   */
  set(cacheKey: string, result) {
    this.map.set(cacheKey, { result, lastSeen: process.hrtime() })
    console.log('setting entry for', cacheKey)
    return result
  }

  get(cacheKey: string, settings) {
    if (this.map.has(cacheKey)) {
      const f = this.map.get(cacheKey)
      // check fresness
      if (process.hrtime(f.lastSeen)[0] < settings.lifetime) return f.result
    } else console.log('cache miss for', cacheKey)
    // cache miss
    return undefined
  }

  static getSettings(settings) {
    const cacheSettings = {
      lifetime: 30,  // seconds
      ...settings['import/cache']
    }
  
    // parse infinity
    if (cacheSettings.lifetime === '∞' || cacheSettings.lifetime === 'Infinity') {
      cacheSettings.lifetime = Infinity
    }
  
    return cacheSettings
  }

}


