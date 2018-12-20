<template>
    <div class="search-control-filter">
        <h4 class="section-title">{{ title }}</h4>
        <ul class="filter-select">
            <li v-for="option in filterOptions">
                <nuxt-link :to="option.link">{{ option.name }}</nuxt-link>
            </li>
        </ul>
    </div>
</template>

<script>
import _get from 'lodash/get'

export default {
    props: {
        title: {
            type: String,
            default: ''
        },
        dimension: {
            type: String,
            required: true
        }
    },
    computed: {
        filterOptions() {
            return _get(
                this.$store.state.pageData,
                `all-${this.dimension}`,
                []
            ).map(option => {
                return {
                    name: _get(option, 'data.name'),
                    link: this.getOptionLink(option)
                }
            })
        }
    },
    methods: {
        getOptionLink(option) {
            const slug = _get(option, 'slugs[0]')
            return {
                ...this.$route,
                query: {
                    ...this.$route.query,
                    [this.dimension]: slug
                }
            }
        }
    }
}
</script>

<style lang="scss">
@import '../assets/scss/vars';

.search-control-filter {
}
</style>
