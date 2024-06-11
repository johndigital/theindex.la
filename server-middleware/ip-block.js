const { RateLimiterMemory } = require('rate-limiter-flexible')

// IP blacklist
const blacklist = [
    '3.224.220.101',
    '52.70.240.171',
    '23.22.35.162',
    '66.249.64.34',
    '66.249.64.35',
    '66.249.64.36',
    '66.249.64.37',
    '66.249.64.38',
    '66.249.64.39',
    '66.249.64.40',
    '66.249.64.41',
    '66.249.64.42',
    '66.249.64.43',
    '66.249.64.44'
    // '127.0.0.1'
]

const rateLimiter = new RateLimiterMemory({
    points: 3,
    duration: 30
})

let bpcounter = 0
export default function(req, res, next) {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    if (blacklist.includes(ip)) {
        // log every 10
        bpcounter++
        if (bpcounter >= 10) {
            console.log('10 blacklist denials')
            bpcounter = 0
        }

        // reject
        res.writeHead(200, { 'Content-Type': 'text/html' })
        return res.end('')
    }

    // IP rate limit
    rateLimiter
        .consume(ip)
        .then(() => next())
        .catch(({ consumedPoints }) => {
            console.log(`Rate Limit hit for IP: ${ip}`)

            // exp backoff, and then reject
            const delay = Math.floor(Math.exp(consumedPoints * 0.75))
            if (delay < 15 * 1000) {
                console.log('delay: ', delay)
                setTimeout(() => next(), delay)
            } else {
                console.log('rejection')
                res.writeHead(200, { 'Content-Type': 'text/html' })
                return res.end('')
            }
        })
}
