import _sampleSize from 'lodash/sampleSize'
import Prismic from 'prismic-javascript'
import LRUCache from 'lru-cache'
import _get from 'lodash/get'

// local log helper
const log = function() {
    console.log(...arguments)
}

const cache = new LRUCache({
    max: 100,
    ttl: 1000 * 60 * 10
})

// helper to init API
const CACHE_TIME = 3 * 60 * 1000
let api, stamp
const getApi = () => {
    const isExpired = new Date().getTime() - stamp > CACHE_TIME
    if (!api || isExpired) {
        stamp = new Date().getTime()
        api = Prismic.api(process.env.prismicUrl)
    }
    return api
}

// helper to get ordering
const getOrdering = query => {
    if (query.sort === 'name') return '[my.artist.name]'
    if (query.sort === 'location') return '[my.artist.city]'
    return '[my.artist.order desc]'
}

// helper to get list of valid dimension IDs
const getDimensionIDs = (query, store, dimension) => {
    // parse slugs from query
    const slugs = _get(query, `[${dimension}]`, '')
        .split(',')
        .filter(Boolean)

    // map over slugs and find corresponding IDs
    const ids = slugs
        .map(slug => {
            const obj = _get(
                store.state.pageData,
                `[all-${dimension}]`,
                []
            ).find(item => {
                return _get(item, 'slugs[0]') == slug
            })
            return obj ? obj.id : null
        })
        .filter(Boolean)
    return ids
}

// Query by URL query string
export const fetchByQs = async ({ query, store, pageSize, page }) => {
    try {
        const api = await getApi()
        pageSize = pageSize || 50
        page = page || 1

        // initial predicates
        const predicates = [Prismic.Predicates.at('document.type', 'artist')]

        // filter search
        if (query.q) {
            predicates.push(Prismic.Predicates.fulltext(`document`, query.q))
        }

        // filter categories
        const catIDs = getDimensionIDs(query, store, 'category')
        if (catIDs.length) {
            predicates.push(
                Prismic.Predicates.any(`my.artist.categories.category`, catIDs)
            )
        }

        // filter types
        const typeIDs = getDimensionIDs(query, store, 'type')
        if (typeIDs.length) {
            predicates.push(
                Prismic.Predicates.any(`my.artist.types.type`, typeIDs)
            )
        }

        // filter regions
        const regionIDs = getDimensionIDs(query, store, 'region')
        if (regionIDs.length) {
            predicates.push(
                Prismic.Predicates.any(`my.artist.region`, regionIDs)
            )
        }

        // filter cities
        const cityIDs = getDimensionIDs(query, store, 'city')
        if (cityIDs.length) {
            predicates.push(Prismic.Predicates.any(`my.artist.city`, cityIDs))
        }

        // run query
        const qOps = {
            pageSize: pageSize,
            page: page,
            orderings: getOrdering(query)
        }
        const key = JSON.stringify({ predicates, qOps })
        let qResults = cache.get(key)
        if (!qResults) {
            log('Hitting Pris API, fetch by QS')
            qResults = await api.query(predicates, qOps)
            cache.set(key, qResults)
        }
        let { results } = qResults

        // no results, try tags instead of search
        if (!results.length && query.q) {
            const q = decodeURIComponent(query.q)
            const tags = String(q)
                .split(',')
                .map(str => str.trim())
                .filter(Boolean)

            predicates.splice(
                1,
                1,
                Prismic.Predicates.at(`document.tags`, tags)
            )

            // run again
            log('Hitting Pris API, tag search')
            const retry = await api.query(predicates, {
                pageSize: pageSize,
                page: page,
                orderings: getOrdering(query)
            })
            results = retry.results
        }

        return results
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
            const key = `uid-${settings.type}-${settings.slug}`
            let artist = cache.get(key)
            if (!artist) {
                log(`Hitting Pris, type-slug ${settings.type}-${settings.slug}`)
                log('cache size: ', cache.itemCount)
                artist = await api.getByUID(settings.type, settings.slug)
                cache.set(key, artist)
            }
            return artist
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
