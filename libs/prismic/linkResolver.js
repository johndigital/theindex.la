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
        if (String(doc.url).match(/:\/\/#/g)) {
            return String(doc.url).replace(/^(http|https):\/\//g, '')
        }

        return doc.url
    }

    // About is home
    if (slug == 'about') return '/'

    // filter links
    if (doc.type === 'type') {
        return `/archive?type=${slug}`
    }

    if (doc.type === 'category') {
        return `/archive?category=${slug}`
    }

    if (doc.type === 'city') {
        return `/archive?city=${slug}`
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
        return `/stories/${slug}`
    }

    return '/not-found'
}

export default resolver
