const sheets = require('./services/sheets')
const moment = require('moment-timezone')

const { SUBMIT_SHEET_ID } = process.env

module.exports = async (req, res, next) => {
    // honeypot check
    if (req.body.water) return res.redirect('/')

    // Connect to subscribe sheet
    const subscribeSheet = require('./services/sheets')(SUBMIT_SHEET_ID)

    // init sheets and add row
    const sheetsClient = await subscribeSheet.init()
    await subscribeSheet.addRow(sheetsClient, {
        Date: moment()
            .tz('America/Los_Angeles')
            .format('ddd, MMM Do YYYY, h:mm a'),
        Submission: req.body.submission
    })

    // send success
    return res.send({
        success: true
    })
}
