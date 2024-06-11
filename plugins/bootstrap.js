import { fetchByType } from '~/libs/prismic'
import _kebabCase from 'lodash/kebabCase'
import _camelCase from 'lodash/camelCase'
import _get from 'lodash/get'
import Vue from 'vue'

// external components
Vue.component('responsive-image', require('fh-components/responsive-image'))
Vue.directive('in-view', require('fh-components/v-in-view'))

// globally register everything in the /components folder
const components = require.context('~/components', true)
components.keys().map(component => {
    // turn './ComponentName.vue' into 'component-name'
    const componentName = _kebabCase(
        component.replace(/^\.\//, '').replace(/\.vue$/, '')
    )

    // register new component globally
    Vue.component(componentName, components(component).default)
})

// globally register everything in the /filters folder
const filters = require.context('~/filters', true)
filters.keys().map(filter => {
    // turn './ComponentName.vue' into 'component-name'
    const filterName = _camelCase(
        filter.replace(/^\.\//, '').replace(/\.js/, '')
    )

    // register new filter globally
    Vue.filter(filterName, filters(filter).default)
})

// Helper to preload pris data
const preloadTypeIfNeeded = async (store, type, key, pageSize) => {
    if (!type) throw new Error('Preload called with no type.')
    if (!key) throw new Error('Preload called with no key.')
    if (!_get(store, `state.pageData[${key}]`)) {
        let data = await fetchByType({ type, pageSize })
        if (pageSize == 1) data = data[0] || null
        store.commit('SET_PAGE_DATA', { key, data })
    }
}

export default async ({ store, route }) => {
    // preload global data
    await Promise.all([
        preloadTypeIfNeeded(store, 'type', 'all-type', 100),
        preloadTypeIfNeeded(store, 'category', 'all-category', 100),
        preloadTypeIfNeeded(store, 'city', 'all-city', 100),
        preloadTypeIfNeeded(store, 'region', 'all-region', 100),
        preloadTypeIfNeeded(store, 'meta', 'meta', 1)
    ])

    // not on about page, show loading
    if (route.path !== '/about') {
        store.commit('SHOW_LOADING')
    }
}
