const prismic = require('@prismicio/client')
const fetch = require('cross-fetch')
const fs = require('fs-extra')
const path = require('path')
const _ = require('lodash')

function hash(str) {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i)
        hash = (hash << 5) - hash + char // Equivalent to hash * 31 + char
        hash |= 0 // Convert to 32bit integer
    }
    return hash
}

const saveLocally = async url => {
    const hashedUrl = hash(url)

    // Determine where it will go
    const ext = path.extname(url).split('?')[0] // remove query params
    const localPath = path.resolve(
        __dirname,
        `../../static/prismic-images/${hashedUrl}${ext}`
    )

    // Download/save if needed
    if (!fs.existsSync(localPath)) {
        const response = await fetch(url)
        if (!response.ok) {
            console.error(`Failed to download image: ${url}`)
            return false
        }
        const buffer = await response.buffer()
        fs.writeFileSync(localPath, buffer)
    }

    return true
}

// Recursively search all properties of allDocuments
const search = (obj, schema) => {
    if (Array.isArray(obj)) {
        return obj.map(item => search(item, schema)).flat()
    } else if (typeof obj === 'object' && obj !== null) {
        if (_.conformsTo(obj, schema)) return [obj]
        else
            return Object.entries(obj).reduce((acc, [k, v]) => {
                acc.push(...search(v, schema))
                return acc
            }, [])
    }
    return []
}

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

    const imageSchema = {
        dimensions: v =>
            _.conformsTo(v, {
                width: n => typeof n === 'number',
                height: n => typeof n === 'number'
            }),
        alt: v => typeof v === 'string' || v === null,
        url: v => typeof v === 'string'
    }
    const legacyImageSchema = {
        width: n => parseInt(n) > 0,
        height: n => parseInt(n) > 0,
        kind: v => v === 'image',
        url: v => typeof v === 'string'
    }
    const mediaScema = {
        link_type: v => v === 'Media',
        kind: v => v === 'file',
        url: v => typeof v === 'string'
    }

    // Find all images
    const allImages = [
        ...search(allDocuments, imageSchema),
        ...search(allDocuments, legacyImageSchema),
        ...search(allDocuments, mediaScema)
    ]

    // Save all docs as JSON
    fs.writeJSONSync(
        path.resolve(__dirname, '../../assets/prismic-data.json'),
        allDocuments
    )
    console.log('Saved all data to prismic-data.json')

    // Download all images in batches
    const batchedImages = _.chunk(allImages, 10)
    for (let i in batchedImages) {
        const savePromises = []

        for (let j in batchedImages[i]) {
            const image = batchedImages[i][j]
            const primaryImage = image?.url
            const lgImage = image?.large?.url

            console.log(
                `Downloading image ${parseInt(i) * 10 + parseInt(j) + 1}/${
                    allImages.length
                }...`
            )
            if (primaryImage) savePromises.push(saveLocally(primaryImage))
            if (lgImage) savePromises.push(saveLocally(lgImage))
        }

        // Wait for all images in this batch to be saved
        await Promise.all(savePromises)
    }
    console.log('All images downloaded and saved locally.')
})()
