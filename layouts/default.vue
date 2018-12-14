<template>
    <div :class="classes">
        <site-header />
        <nuxt />
        <site-sidebar />
    </div>
</template>

<script>
import _kebabCase from 'lodash/kebabCase'

export default {
    watch: {
        $route(to, from = {}) {
            // set referral
            const { fullPath, params, query, name } = from
            this.$store.commit('SET_REFERRED', {
                fullPath,
                params,
                query,
                name
            })
        }
    },
    computed: {
        classes() {
            return [
                'container',
                `route-${_kebabCase(this.$route.name)}`,
                `breakpoint-${this.$store.getters.breakpoint}`,
                { 'sidebar-open': this.$store.state.sidebarOpen },
                { 'is-touch': this.$store.state.browser.hasTouch },
                { 'not-touch': !this.$store.state.browser.hasTouch },
                { 'fonts-loading': this.$store.state.browser.fontsLoading },
                { 'fonts-loaded': this.$store.state.browser.fontsLoaded }
            ]
        }
    }
}
</script>

<style lang="scss">
@import '../assets/scss/vars';

.container {
    main {
        transition: margin-left 400ms $easeInOutQuad;
    }
    &.sidebar-open main {
        margin-left: 320px;
    }
}
</style>
