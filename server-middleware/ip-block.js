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

// const ipTable = {}
// const maybeDelay = async (ip) => {
//     ipTable[ip] = (ipTable[ip] || 0) + 1
//     const
// }

export default function(req, res, next) {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    if (blacklist.includes(ip)) {
        console.log('Denied blacklist IP: ', ip)
        res.writeHead(200, { 'Content-Type': 'text/html' })
        return res.end('')
    }

    // console.log(req.url)
    next()
}
