import FontFaceObserver from 'fontfaceobserver'
import _uniq from 'lodash/uniq'

// Santa's little helpers
const resolveWeights = font => {
    const declared = font.weights || []
    const single = font.weight ? [font.weight] : []
    const all = _uniq(declared.concat(single))
    return all.length ? all : [400]
}
const resolveStyles = font => {
    const declared = font.styles || []
    const single = font.style ? [font.style] : []
    const all = _uniq(declared.concat(single))
    return all.length ? all : ['normal']
}

// Primary load function
export default ops => {
    const fonts = ops instanceof Array ? ops : [ops]
    const families = []

    // declare all fonts
    fonts.forEach(font => {
        // resolve weights & styles
        const weights = resolveWeights(font)
        const styles = resolveStyles(font)

        // split all into separate declarations
        weights.forEach(weight => {
            styles.forEach(style => {
                families.push({
                    name: font.name,
                    weight,
                    style
                })
            })
        })
    })

    // Load all in parallel
    return Promise.all(
        families.map(fam => {
            const font = new FontFaceObserver(fam.name, {
                weight: fam.weight,
                style: fam.style
            })
            return font.load()
        })
    )
}
