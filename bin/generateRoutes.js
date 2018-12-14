import linkResolver from '../libs/prismic/linkResolver'
import prismic from '../libs/prismic'
import _ from 'lodash'

// target all docs of these types
const GENERATE_DOCTYPES = ['post', 'page']

export default async () => {
    const api = await prismic

    // loop each and add result of
    // linkResolver to routes list
    let routes = []
    for (let i = 0; i < GENERATE_DOCTYPES.length; i++) {
        let type = GENERATE_DOCTYPES[i]
        let { results } = await api.query(`[at(document.type, "${type}")]`, {
            pageSize: 100
        })
        routes = routes.concat(results.map(linkResolver))
    }

    return _.uniq(routes)
}
