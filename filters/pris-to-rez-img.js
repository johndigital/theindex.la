const path = require('path')

function hash(str) {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i)
        hash = (hash << 5) - hash + char // Equivalent to hash * 31 + char
        hash |= 0 // Convert to 32bit integer
    }
    return hash
}

const urlToLocalPath = url => {
    // Determine where it will go
    const hashedUrl = hash(url)
    const ext = path.extname(url).split('?')[0] // remove query params
    return `/prismic-images/${hashedUrl}${ext}`
}

export default img => {
    if (!img) return false
    if (img.dimensions) {
        return {
            sizes: {
                fullscreen: {
                    url: urlToLocalPath(img.url),
                    height: img.dimensions.height,
                    width: img.dimensions.width
                }
            },
            content: img.alt
        }
    } else if (img.width) {
        return {
            sizes: {
                fullscreen: {
                    url: urlToLocalPath(img.url),
                    height: Number(img.height),
                    width: Number(img.width)
                }
            }
        }
    }
}
