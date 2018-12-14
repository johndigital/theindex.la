import _kebabCase from 'lodash/kebabCase'
import _camelCase from 'lodash/camelCase'
import Vue from 'vue'

export default ({ store }, inject) => {
    // external components
    // Vue.component('responsive-image', require('fh-components/responsive-image'))
    Vue.component('a-div', require('fh-components/a-div'))

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
