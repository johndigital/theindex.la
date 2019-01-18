const sheets = require('./services/sheets')
const moment = require('moment-timezone')

const { SUBSCRIBE_SHEET_ID } = process.env

module.exports = async (req, res, next) => {
    // honeypot check
    if (req.body.water) return res.redirect('/')

    // Connect to subscribe sheet
    const subscribeSheet = require('./services/sheets')(SUBSCRIBE_SHEET_ID)

    // init sheets and add row
    const sheetsClient = await subscribeSheet.init()
    await subscribeSheet.addRow(sheetsClient, {
        Date: moment()
            .tz('America/Los_Angeles')
            .format('ddd, MMM Do YYYY, h:mm a'),
        Email: req.body.email
    })

    // send success
    return res.send({
        success: true
    })
}
