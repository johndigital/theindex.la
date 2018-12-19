const _ = require('lodash')

const processArtist = json => {
    json.name = [
        {
            type: 'h2',
            content: {
                text: json.name,
                spans: []
            }
        }
    ]
    json.featureimage = json.featureImage
    delete json.featureImage

    json.gallery = _.get(json, 'gallery', []).map(gItem => {
        if (gItem.image) {
            gItem.image = {
                origin: {
                    id: gItem.image.id,
                    height: Number(gItem.image.height),
                    width: Number(gItem.image.width),
                    url: gItem.image.url
                },
                width: Number(gItem.image.width),
                height: Number(gItem.image.height),
                url: gItem.image.url
            }
        }
        return gItem
    })
    return json
}

const processFeature = json => {
    json.type = 'story'
    json.name = [
        {
            type: 'h2',
            content: {
                text: json.name,
                spans: []
            }
        }
    ]
    if (json.colors && json.colors.length) {
        const colors = _.first(json.colors)
        json.background_color = colors.backgroundColor
        json.text_color = colors.textColor
        json.border_color = colors.borderColor
        delete json.colors
    }
    return json
}

module.exports = json => {
    if (json.type === 'artist') return processArtist(json)
    if (json.type === 'feature') return processFeature(json)
    if (json.type === 'region') return _.omit(json, ['order'])
    return json
}
