import _sampleSize from 'lodash/sampleSize'
import Prismic from 'prismic-javascript'
import _get from 'lodash/get'

// helper to init API
let api
const getApi = () => {
    if (!api) api = Prismic.api(process.env.prismicUrl)
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
    const api = await getApi()
    pageSize = pageSize || 20
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
        predicates.push(Prismic.Predicates.any(`my.artist.types.type`, typeIDs))
    }

    // filter regions
    const regionIDs = getDimensionIDs(query, store, 'region')
    if (regionIDs.length) {
        predicates.push(Prismic.Predicates.any(`my.artist.region`, regionIDs))
    }

    // filter cities
    const cityIDs = getDimensionIDs(query, store, 'city')
    if (cityIDs.length) {
        predicates.push(Prismic.Predicates.any(`my.artist.city`, cityIDs))
    }

    // run query
    let { results } = await api.query(predicates, {
        pageSize: pageSize,
        page: page,
        orderings: getOrdering(query)
    })

    // no results, try tags instead of search
    if (!results.length && query.q) {
        const q = decodeURIComponent(query.q)
        const tags = String(q)
            .split(',')
            .map(str => str.trim())
            .filter(Boolean)

        predicates.splice(1, 1, Prismic.Predicates.at(`document.tags`, tags))

        // run again
        const retry = await api.query(predicates, {
            pageSize: pageSize,
            page: page,
            orderings: getOrdering(query)
        })
        results = retry.results
    }

    return results
}

// Fetch next document by type
export const fetchNextDocument = async ops => {
    const api = await getApi()

    // resolve settings
    const settings = {
        type: 'feature',
        doc: null,
        ...ops
    }

    // make sure we have a document
    if (settings.doc) {
        const predicates = [
            Prismic.Predicates.at('document.type', settings.type),
            Prismic.Predicates.dateBefore(
                'my.feature.timestamp',
                settings.doc.data.timestamp
            )
        ]
        const { results } = await api.query(predicates, {
            pageSize: 1,
            orderings: '[my.feature.timestamp desc]'
        })

        // success? return
        if (results && results.length) {
            return results[0]
        }
    }

    return null
}

// Algorithm to find any docs
// related to a given doc
export const fetchRelated = async doc => {
    const api = await getApi()

    // make sure we have a document
    if (doc) {
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
            Prismic.Predicates.any(`my.${doc.type}.categories.category`, catIDs)
        ]

        // run query
        const { results } = await api.query(predicates, {
            pageSize: 6,
            orderings: '[my.feature.timestamp desc]'
        })

        // return results filtered by
        return results
    }

    return null
}

// Query by type
export const fetchByType = async ops => {
    const api = await getApi()

    // resolve settings
    const settings = {
        type: 'page',
        slug: '',
        pageSize: 40,
        page: 1,
        orderings: '',
        ...ops
    }

    const predicates = [Prismic.Predicates.at('document.type', settings.type)]

    // if slug was specified
    if (settings.slug) {
        const artist = await api.getByUID(settings.type, settings.slug)
        return artist
    }

    // run query
    const { results } = await api.query(predicates, {
        pageSize: settings.pageSize,
        page: settings.page,
        orderings: settings.orderings
    })
    return results
}
