require('babel-register')({
    presets: ['env']
})
require('babel-polyfill')

const scrollBehavior = (to, from, savedPosition) => {
    const _get = require('lodash/get')

    let position = { x: 0, y: 0 }

    // savedPosition is only available for popstate navigations (back button)
    if (savedPosition) {
        position = savedPosition
    }

    // recover scroll if returning to same route
    const previous = _get(
        window.$nuxt,
        '$store.state.browser.referredFrom.fullPath'
    )
    if (to.fullPath === previous) {
        position = {
            x: 0,
            y: _get(window.$nuxt, '$store.state.browser.referredFrom.sTop') || 0
        }
    }

    // resolve
    return new Promise(resolve => {
        window.$nuxt.$once('triggerScroll', () => {
            if (to.hash && document.querySelector(to.hash)) {
                position = { selector: to.hash }
            }
            resolve(position)
        })
    })
}

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
            { property: 'og:url', content: 'https://theindex.la' },
            { property: 'og:type', content: 'website' },
            { hid: 'og:title', property: 'og:title', content: 'Index' },
            {
                hid: 'og:image',
                property: 'og:image',
                content: '/images/screenshot.png'
            },
            {
                hid: 'og:description',
                property: 'og:description',
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
    transition: {
        name: 'page-fade',
        mode: 'out-in'
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
        { src: '~/plugins/ga', ssr: false },
        '~/plugins/bootstrap'
    ],
    router: {
        scrollBehavior
    },
    serverMiddleware: ['~/api', '~/server-middleware/ip-block']
}
