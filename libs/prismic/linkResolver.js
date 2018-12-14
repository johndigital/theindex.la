import _get from 'lodash/get'

const resolver = doc => {
    if (doc == undefined) {
        return '/not-found'
    }

    const slug = doc.uid || doc.slug || _get(doc, 'slugs[0]')

    if (doc.isBroken) {
        return '/not-found'
    }

    // external link
    if (doc.link_type === 'Web') {
        return doc.url
    }

    return '/not-found'
}

export default resolver
