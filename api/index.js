require('../env')

const express = require('express')
const bodyParser = require('body-parser')
const { Router } = require('express')

// Create express instnace
const app = express()
const router = Router()

// JSON parsing
app.use(bodyParser.urlencoded())
app.use(bodyParser.json())

// routes
router.post('/submit', require('./submit'))
router.post('/subscribe', require('./subscribe'))

// fallback, redirect
router.use((req, res) => {
    return res.redirect('/')
})

// connect router
app.use(router)

module.exports = router

// Export the server middleware
module.exports = {
    path: '/api',
    handler: app
}
