require('babel-register')({
    presets: ['env']
})
require('babel-polyfill')

module.exports = {
    env: {
        prismicUrl: 'https://index-la.prismic.io/api/v2'
    },
    head: {
        title: 'Index',
        meta: [
            { charset: 'utf-8' },
            {
                name: 'viewport',
                content:
                    'width=device-width, initial-scale=1, viewport-fit=cover'
            },
            { name: 'og:url', content: 'https://theindex.la' },
            { name: 'og:type', content: 'website' },
            { name: 'og:title', content: 'Index' },
            { name: 'og:image', content: '/images/screenshot.png' },
            {
                name: 'og:description',
                content:
                    'Index is a library of contemporary photographers and filmmakers—a digital tool for finding talent from around the world.'
            }
        ],
        link: [
            // { rel: 'apple-touch-icon', href: '/images/favicon.ico' },
            { id: 'fav', rel: 'shortcut icon', href: '/images/favicon.png' },
            { rel: 'stylesheet', href: '/fonts/fonts.css' },
            { rel: 'author', href: `/humans.txt` }
        ]
    },
    build: {
        vendor: ['lodash/get', 'lodash/throttle', 'popmotion']
    },
    generate: {
        // routes: require('./bin/generateRoutes').default,
        dir: 'dist',
        fallback: '404.html'
    },
    loading: false,
    css: ['@/assets/scss/_base.scss'],
    plugins: [
        { src: '~/plugins/browser', ssr: false },
        // { src: '~/plugins/ga', ssr: false },
        '~/plugins/bootstrap'
    ]
}
