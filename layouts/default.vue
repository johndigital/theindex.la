<template>
    <div :class="classes">
        <site-header />
        <nuxt />
        <site-sidebar />
        <site-menu />
        <site-overlay-form />
        <loading-screen />
    </div>
</template>

<script>
import _kebabCase from 'lodash/kebabCase'

export default {
    watch: {
        $route(to, from = {}) {
            // set referral
            const { fullPath, params, query, name } = from
            setTimeout(() => {
                this.$store.commit('SET_REFERRED', {
                    fullPath,
                    params,
                    query,
                    name,
                    sTop: this.$store.state.browser.sTop || 0
                })
            }, 100)
        }
    },
    mounted() {
        // set timer to remove load screen
        setTimeout(() => {
            this.$store.commit('REMOVE_LOADING')
        }, 2500)
    },
    computed: {
        classes() {
            return [
                'container',
                `route-${_kebabCase(this.$route.name)}`,
                `breakpoint-${this.$store.getters.breakpoint}`,
                { 'sidebar-open': this.$store.state.sidebarOpen },
                { 'menu-open': this.$store.state.menuOpen },
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
    overflow-x: hidden;

    main {
        transition: margin-left 400ms $easeInOutQuad;
    }
    &.sidebar-open main {
        margin-left: 320px;
    }
}

// mobile breakpoints
@media #{ $lt-phone } {
    .container {
        main {
            width: 100%;
        }
        &.sidebar-open main {
            margin-left: 80%;
        }
    }
}
</style>
