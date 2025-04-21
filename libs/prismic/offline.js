import _sampleSize from 'lodash/sampleSize'
// import Prismic from 'prismic-javascript'
// import LRUCache from 'lru-cache'
import _get from 'lodash/get'
import Fuse from 'fuse.js'

// local log helper
const log = function() {
    if (process.server) {
        console.log(...arguments)
    }
}

// helper to init API
let api
const allPrismicDocs = require('~/assets/prismic-data.json')
const getApi = () => {
    if (!api) {
        const fuseOptions = {
            useExtendedSearch: true,
            keys: [
                'id',
                'uid',
                'tags',
                'type',
                {
                    name: 'name',
                    getFn: d => d.data.name
                },
                {
                    name: 'city',
                    getFn: d => _get(d, 'data.city.id')
                },
                {
                    name: 'region',
                    getFn: d => _get(d, 'data.region.id')
                },
                {
                    name: 'types',
                    getFn: d => {
                        return _get(d, 'data.types', []).map(type => {
                            return _get(type, 'type.id')
                        })
                    }
                },
                {
                    name: 'categories',
                    getFn: d => {
                        return _get(d, 'data.categories', []).map(cat => {
                            return _get(cat, 'category.id')
                        })
                    }
                }
            ]
        }

        api = new Fuse(allPrismicDocs, fuseOptions)
    }
    return api
}

// helper to get list of valid dimension IDs
const getDimensionIDs = (query, dimension) => {
    // parse slugs from query
    const slugs = _get(query, `[${dimension}]`, '')
        .split(',')
        .filter(Boolean)

    // map over slugs and find corresponding IDs
    const ids = slugs
        .map(slug => {
            const obj = allPrismicDocs.find(doc => {
                return doc.type == dimension && _get(doc, 'slugs[0]') == slug
            })
            return obj ? obj.id : null
        })
        .filter(Boolean)
    return ids
}

// helper to get a date object for a doc
const docTime = doc => {
    if (doc.first_publication_date) return new Date(doc.first_publication_date)
    return new Date(doc.last_publication_date)
}

// Query by URL query string
export const fetchByQs = async ({ query, pageSize, page }) => {
    try {
        const api = await getApi()
        pageSize = pageSize || 50
        page = page || 1

        const search = {
            $and: [{ type: 'artist' }]
        }

        // add text search
        if (query.q) {
            search.$or = [{ tags: query.q }, { name: query.q }]
        }

        // filter categories
        const catIDs = getDimensionIDs(query, 'category')
        if (catIDs.length) {
            search.$and = search.$and.concat(
                catIDs.map(c => ({ categories: '=' + c }))
            )
        }

        // filter types
        const typeIDs = getDimensionIDs(query, 'type')
        if (typeIDs.length) {
            search.$and = search.$and.concat(
                typeIDs.map(t => ({ types: '=' + t }))
            )
        }

        // filter cities
        const cityIDs = getDimensionIDs(query, 'city')
        if (cityIDs.length) {
            search.$and = search.$and.concat(
                cityIDs.map(c => ({ city: '=' + c }))
            )
        }

        // filter regions
        const regionIDs = getDimensionIDs(query, 'region')
        if (regionIDs.length) {
            search.$and = search.$and.concat(
                regionIDs.map(r => ({ region: '=' + r }))
            )
        }

        // query results
        const results = api
            .search(search, {
                findAllMatches: true,
                useExtendedSearch: true
            })
            .map(({ item }) => item)
            .sort((a, b) => {
                if (query.sort === 'name') {
                    return a.data.name.localeCompare(b.data.name)
                } else if (query.sort === 'latest') {
                    return docTime(b) - docTime(a)
                } else {
                    return (a.data.order || 2000) - (b.data.order || 2000)
                }
            })

        // paginate
        return results.slice((page - 1) * pageSize, page * pageSize)
    } catch (err) {
        log('Error in fetchByQs', err)
        return []
    }
}

// Fetch next document by type
export const fetchNextDocument = async ops => {
    try {
        const api = await getApi()

        // resolve settings
        const settings = Object.assign(
            {
                type: 'feature',
                doc: null
            },
            ops
        )

        // make sure we have a document
        if (settings.doc) {
            const stamp = docTime(settings.doc)

            const search = {
                type: `=${settings.type}`
            }

            const results = api
                .search(search)
                .map(({ item }) => item)
                .sort((a, b) => {
                    return docTime(b) - docTime(a)
                })
                .filter(doc => {
                    return docTime(doc) < stamp
                })

            // success? return
            if (results && results.length) return results[0]
        }

        return null
    } catch (err) {
        return null
    }
}

// Algorithm to find any docs
// related to a given doc
export const fetchRelated = async doc => {
    try {
        const api = await getApi()

        // make sure we have a document
        if (doc) {
            // map IDs into array
            let catIDs = doc.data.categories
                .map(cat => {
                    return _get(cat, 'category.id')
                })
                .filter(Boolean)

            const search = {
                $and: [
                    { type: `=${doc.type}` },
                    { id: `!${doc.id}` },
                    {
                        $or: catIDs.map(cat => {
                            return { categories: `=${cat}` }
                        })
                    }
                ]
            }

            // run query
            const results = await api
                .search(search)
                .map(({ item }) => item)
                .sort((a, b) => {
                    return docTime(b) - docTime(a)
                })
                .slice(0, 6)

            // return results
            return results
        }

        return null
    } catch (err) {
        return null
    }
}

// Query by type
export const fetchByType = async ops => {
    try {
        const api = await getApi()

        // resolve settings
        const settings = Object.assign(
            {
                type: 'page',
                slug: '',
                pageSize: 50,
                page: 1,
                orderings: ''
            },
            ops
        )

        const search = {
            $and: [{ type: `=${settings.type}` }]
        }

        // if slug was specified
        if (settings.slug) {
            // invalid slug
            if (/\.|\{/.test(settings.slug)) return false

            search.$and.push({
                uid: `=${settings.slug}`
            })

            const foundDoc = api
                .search(search, {
                    useExtendedSearch: true
                })
                .map(({ item }) => item)[0]

            return foundDoc
        }

        // query results
        const results = api
            .search(search, {
                findAllMatches: true,
                useExtendedSearch: true
            })
            .map(({ item }) => item)
            .sort((a, b) => {
                return docTime(b) - docTime(a)
            })

        // paginate
        return results.slice(
            (settings.page - 1) * settings.pageSize,
            settings.page * settings.pageSize
        )
    } catch (err) {
        console.log('error fetching by type', err)
        return []
    }
}
