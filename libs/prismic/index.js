import Prismic from 'prismic-javascript'

const getApi = () => {
    return Prismic.api(process.env.prismicUrl)
}

export default getApi()
