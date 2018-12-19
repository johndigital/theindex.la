import { fetchByType } from '~/libs/prismic'
import _kebabCase from 'lodash/kebabCase'
import _camelCase from 'lodash/camelCase'
import Vue from 'vue'

export default async ({ store }, inject) => {
    // external components
    Vue.component('responsive-image', require('fh-components/responsive-image'))

    // preload global data
    const [allTypes, allCats, allCities] = await Promise.all([
        fetchByType({ type: 'type', pageSize: 100 }),
        fetchByType({ type: 'category', pageSize: 100 }),
        fetchByType({ type: 'city', pageSize: 100 })
    ])
    store.commit('SET_PAGE_DATA', {
        key: 'types',
        data: allTypes
    })
    store.commit('SET_PAGE_DATA', {
        key: 'categories',
        data: allCats
    })
    store.commit('SET_PAGE_DATA', {
        key: 'cities',
        data: allCities
    })

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
}
