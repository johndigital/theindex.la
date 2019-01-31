import { fetchByType } from '../libs/prismic'
import jsoncsv from 'json-csv'
import moment from 'moment'
import _ from 'lodash'

// Make sure prismic base is set
process.env.prismicUrl = 'https://index-la.prismic.io/api/v2'

module.exports = async (req, res, next) => {
    let artists = []
    let end = false
    let pageNum = 1

    // loop and fetch all artists
    while (!end) {
        const page = await fetchByType({
            type: 'artist',
            pageSize: 100,
            page: pageNum
        })
        artists = artists.concat(page)
        pageNum++
        if (!page || page.length < 100) {
            end = true
        }
    }

    // format all artists
    const formatted = artists.map(artist => {
        return {
            name: _.get(artist, 'data.name'),
            email: _.get(artist, 'data.email'),
            website: _.get(artist, 'data.website'),
            instagram: _.get(artist, 'data.instagram'),
            region: _.get(artist, 'data.region.slug'),
            city: _.get(artist, 'data.city.slug')
        }
    })

    // Create CSV from json
    return jsoncsv.csvBuffered(
        formatted,
        {
            fields: [
                {
                    name: 'name',
                    label: 'Name'
                },
                {
                    name: 'email',
                    label: 'Email'
                },
                {
                    name: 'website',
                    label: 'Website'
                },
                {
                    name: 'instagram',
                    label: 'Instagram'
                },
                {
                    name: 'region',
                    label: 'Region'
                },
                {
                    name: 'city',
                    label: 'City'
                }
            ]
        },
        function(err, csv) {
            if (err) return next(err)
            const dateString = moment(new Date()).format('MM-DD-YYYY')
            res.set(
                'Content-Disposition',
                `attachment; filename="artists-${dateString}.csv"`
            )
            return res.send(new Buffer.from(csv))
        }
    )
}
