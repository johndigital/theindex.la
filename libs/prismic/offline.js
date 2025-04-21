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
            search.$and.push({
                categories: catIDs.map(c => '=' + c).join(' ')
            })
        }

        // filter types
        const typeIDs = getDimensionIDs(query, 'type')
        if (typeIDs.length) {
            search.$and.push({
                types: typeIDs.map(t => '=' + t).join(' ')
            })
        }

        // filter cities
        const cityIDs = getDimensionIDs(query, 'city')
        if (cityIDs.length) {
            search.$and.push({
                city: cityIDs.map(c => '=' + c).join(' ')
            })
        }

        // filter regions
        const regionIDs = getDimensionIDs(query, 'region')
        if (regionIDs.length) {
            search.$and.push({
                region: regionIDs.map(c => '=' + c).join(' ')
            })
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
            const key = `next-${JSON.stringify(ops)}`
            if (cache.has(key)) return cache.get(key)

            const stamp =
                settings.doc.data.timestamp ||
                settings.doc.first_publication_date

            if (!stamp) {
                cache.set(key, null)
                return null
            }
            const predicates = [
                Prismic.Predicates.at('document.type', settings.type),
                Prismic.Predicates.dateBefore('my.feature.timestamp', stamp)
            ]
            log('Hitting Pris API, fetch next doc')
            const { results } = await api.query(predicates, {
                pageSize: 1,
                orderings: '[my.feature.timestamp desc]'
            })

            // success? return
            if (results && results.length) {
                cache.set(key, results[0])
                return results[0]
            }
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
            const key = `related-${doc.id}`
            let results = cache.get(key)

            if (!results) {
                // map IDs into array
                let catIDs = doc.data.categories
                    .map(cat => {
                        return _get(cat, 'category.id')
                    })
                    .filter(Boolean)

                // build query
                let predicates = [
                    Prismic.Predicates.at('document.type', doc.type),
                    Prismic.Predicates.not('document.id', doc.id),
                    Prismic.Predicates.any(
                        `my.${doc.type}.categories.category`,
                        catIDs
                    )
                ]

                // run query
                log('Hitting Pris API, fetch related')
                results = await api
                    .query(predicates, {
                        pageSize: 6,
                        orderings: '[my.feature.timestamp desc]'
                    })
                    .then(r => r.results)
                cache.set(key, results)
            }

            // return results filtered by
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
                pageSize: 40,
                page: 1,
                orderings: ''
            },
            ops
        )

        const predicates = [
            Prismic.Predicates.at('document.type', settings.type)
        ]

        // if slug was specified
        if (settings.slug) {
            // invalid slug
            if (/\.|\{/.test(settings.slug)) return false

            const key = `uid-${settings.type}-${settings.slug}`
            if (!cache.has(key)) {
                log(`Hitting Pris, type-slug ${settings.type}-${settings.slug}`)
                log('cache size: ', cache.itemCount)
                const doc = await api.getByUID(settings.type, settings.slug)
                cache.set(key, doc)
            }
            return cache.get(key)
        }

        // run query
        const qOps = {
            pageSize: settings.pageSize,
            page: settings.page,
            orderings: settings.orderings
        }
        const key = JSON.stringify({ predicates, qOps })
        let qResults = cache.get(key)
        if (!qResults) {
            log('Hitting Pris API, fetch by type no slug')
            qResults = await api.query(predicates, qOps)
            cache.set(key, qResults)
        }
        let { results } = qResults

        return results
    } catch (err) {
        return []
    }
}
