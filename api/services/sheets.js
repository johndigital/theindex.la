const { google } = require('googleapis')
const { promisify } = require('util')
const _ = require('lodash')

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWQYZ'
const offset = 2 // 1 indexed rows, first row is header

const withIndices = arr => _.zip(arr, _.range(arr.length))

// get env variables
const { GOOGLE_EMAIL, GOOGLE_KEY } = process.env

// init with sheet ID
module.exports = sheetID => {
    const sheets = {
        async authorize() {
            const jwt = new google.auth.JWT(
                GOOGLE_EMAIL,
                null,
                GOOGLE_KEY,
                ['https://www.googleapis.com/auth/spreadsheets'],
                null
            )

            await promisify(jwt.authorize.bind(jwt))()
            return jwt
        },

        // auth & initialize
        async init() {
            const auth = await sheets.authorize()
            const client = google.sheets({
                version: 'v4',
                auth
            })

            return client
        },

        // Get all spreadsheet data
        async fetch(client) {
            const result = await promisify(
                client.spreadsheets.values.get.bind(client)
            )({
                spreadsheetId: sheetID,
                range: 'A1:Z9999'
            })

            const rows = result.data.values
            const names = rows[0]
            const values = rows.slice(1)

            const data = values.map(row => {
                const pairs = _.zip(names, row)
                return _.fromPairs(pairs)
            })

            return data
        },

        // find the row index with the given ID
        // NOTE: this is not very efficient since it loads the whole
        // sheet into memory and scans through it.
        // we could potentially store the row index in the database
        // but it's possible it would not always be accurate
        async index(client, id) {
            const data = await sheets.fetch(client)

            return _.findIndex(data, row => {
                return parseInt(row.id) === id
            })
        },

        async names(client) {
            const result = await promisify(
                client.spreadsheets.values.get.bind(client)
            )({
                spreadsheetId: sheetID,
                range: 'A1:Z1'
            })

            return result.data.values[0]
        },

        // push a row by index
        async update(client, index, data) {
            const row = index + offset
            const columns = await sheets.names(client)
            const updates = []

            for (let [name, index] of withIndices(columns)) {
                const value = data[name]

                if (value !== undefined) {
                    const letter = letters[index]
                    const range = `${letter}${row}:${letter}${row}`
                    const values = [[value]]

                    updates.push({
                        range,
                        values
                    })
                }
            }

            await promisify(
                client.spreadsheets.values.batchUpdate.bind(client)
            )({
                spreadsheetId: sheetID,
                resource: {
                    valueInputOption: 'RAW',
                    data: updates
                }
            })
        },

        async addRow(client, data) {
            const rows = await sheets.fetch(client)
            return sheets.update(client, rows.length, data)
        }
    }

    return sheets
}
