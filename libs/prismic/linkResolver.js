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

    // filter links
    if (doc.type === 'type') {
        return `/?type=${slug}`
    }

    if (doc.type === 'category') {
        return `/?category=${slug}`
    }

    if (doc.type === 'city') {
        return `/?city=${slug}`
    }

    // artist
    if (doc.type === 'artist') {
        return `/artist/${slug}`
    }

    // page
    if (doc.type === 'page') {
        return `/${slug}`
    }

    // ftory
    if (doc.type === 'feature') {
        return `/feature/${slug}`
    }

    return '/not-found'
}

export default resolver
