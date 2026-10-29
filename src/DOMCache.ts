const MAX_CACHE_SIZE = 1e4

/**
 * A cache for DOM elements
 */
let DOMCache: Record<string, HTMLElement> = {}
let cacheSize = 0

export const DOMCacheGetOrSet = (id: string) => {
  if (cacheSize > MAX_CACHE_SIZE) {
    console.warn(`Possible memory leak detected ${cacheSize} DOM elements cached`)

    DOMCache = {}
    cacheSize = 0
  }

  const cached = DOMCache[id]
  if (cached)
    return cached

  const element = document.getElementById(id)
  if (!element)
    throw new TypeError(`Element with id #"${id}" was not found on page?`)

  cacheSize += 1
  return DOMCache[id] = element
}
