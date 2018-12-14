import _throttle from 'lodash/throttle'

// resize handler
const setSizes = store => {
    store.commit('SET_WIN_WIDTH', window.innerWidth)
    store.commit('SET_WIN_HEIGHT', window.innerHeight)
    const docHeight = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
    )
    store.commit('SET_DOC_HEIGHT', docHeight)
}

// scroll handler
const setScroll = store => {
    const sTop = window.pageYOffset || document.documentElement.scrollTop
    store.commit('SET_SCROLL_TOP', sTop)
}

// plugin
export default ({ store }, inject) => {
    // polyfill
    require('string.prototype.includes')

    // size/scroll handlers
    const onResize = () => setSizes(store)
    const onScroll = () => setScroll(store)

    // set listeners + kick
    window.addEventListener('resize', _throttle(onResize, 50))
    window.addEventListener('scroll', _throttle(onScroll, 200))
    onResize()
    onScroll()

    // load fonts
    store.dispatch('LOAD_FONTS')
}
