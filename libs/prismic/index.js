import Prismic from 'prismic-javascript'

// helper to init API
let api
const getApi = () => {
    if (!api) api = Prismic.api(process.env.prismicUrl)
    return api
}

// Query by type
export const fetchByType = async ops => {
    const api = await getApi()

    // resolve settings
    const settings = {
        type: 'page',
        pageSize: 40,
        page: 1,
        orderings: '',
        ...ops
    }

    // run query
    const { results } = await api.query(
        Prismic.Predicates.at('document.type', settings.type),
        {
            pageSize: settings.pageSize,
            page: settings.page,
            orderings: settings.orderings
        }
    )
    return results
}
