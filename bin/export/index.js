const prismic = require('@prismicio/client')
const fs = require('fs-extra')
const path = require('path')
const _ = require('lodash')

let client
const getApi = () => {
    if (!client) client = prismic.createClient('index-la')
    return client
}

// run
;(async () => {
    // get all prismic documents
    const client = await getApi()

    const allDocuments = []
    let page = 1
    const { total_pages } = await client.get({
        pageSize: 100,
        orderings: 'document.first_publication_date desc'
    })

    while (page <= total_pages) {
        const { results } = await client.get({
            pageSize: 100,
            page,
            orderings: 'document.first_publication_date desc'
        })
        allDocuments.push(...results)
        page++
        console.log('looping pages...')
    }

    fs.writeJSONSync(
        path.resolve(__dirname, '../../assets/prismic-data.json'),
        allDocuments
    )
    console.log('Saved all data to prismic-data.json')
})()
