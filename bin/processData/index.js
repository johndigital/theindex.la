const process = require('./process')
const Zip = require('node-zip')
const fs = require('fs-extra')
const _ = require('lodash')

const EXPORT_ID = '19-12-2018#13-32-46_index-la'
const DATA_PATH = './data'

const zipFiles = (group = [], output) => {
    const zipper = new Zip()
    for (let i in group) {
        const fileObj = group[i]
        const fileName = fileObj.name
        const fileContents = JSON.stringify(fileObj.data)
        zipper.file(fileName, fileContents)
    }
    const data = zipper.generate({ base64: false, compression: 'DEFLATE' })
    fs.writeFileSync(output, data, { encoding: 'binary' })
}

// run
;(async () => {
    const folderPath = `${DATA_PATH}/${EXPORT_ID}`
    const outputPath = `${DATA_PATH}/${EXPORT_ID}-processed`
    const files = fs.readdirSync(folderPath)

    // ensure & empty output dir
    await fs.ensureDir(outputPath)
    await fs.emptyDir(outputPath)

    // read all files into objects
    const objects = await Promise.all(
        files.map(async fileName => {
            const filePath = `${folderPath}/${fileName}`
            const data = await fs.readJson(filePath)
            return {
                name: fileName,
                data
            }
        })
    )

    // set types & order
    const types = ['category', 'city', 'region', 'type', 'artist']

    // loop types
    for (let k in types) {
        const type = types[k]

        // filter by type and process data
        const filterProcessed = objects
            .filter(o => {
                return o.data.type === type
            })
            .map(o => {
                o.data = process(o.data)
                return o
            })

        // sort into groups
        const groups = _.chunk(filterProcessed, 180)

        // loop and zip groups
        for (let i in groups) {
            const group = groups[i]

            // zip files
            console.log(`zipping file group: ${type}-${Number(i) + 1}`)
            zipFiles(group, `${outputPath}/${type}-${Number(i) + 1}.zip`)
        }
    }

    console.log('Complete.')
})()
