<template>
    <nuxt-link :class="classes" :to="link"> {{ name }} </nuxt-link>
</template>

<script>
import _without from 'lodash/without'
import _omit from 'lodash/omit'
import _get from 'lodash/get'

export default {
    props: {
        dimension: {
            type: String,
            required: true
        },
        option: {
            type: Object,
            required: true
        }
    },
    computed: {
        classes() {
            return [
                'search-control-filter-option',
                { 'item-active': this.itemActive }
            ]
        },
        currentSlugs() {
            return _get(this.$route, `query[${this.dimension}]`, '')
                .split(',')
                .filter(Boolean)
        },
        slug() {
            return _get(this.option, 'slugs[0]')
        },
        name() {
            return _get(this.option, 'data.name', '')
        },
        itemActive() {
            return this.currentSlugs.includes(this.slug)
        },
        linkSlug() {
            let slugItems = []
            if (this.itemActive) {
                slugItems = _without(this.currentSlugs, this.slug)
            } else {
                slugItems = this.currentSlugs.concat([this.slug])
            }
            return slugItems.join(',')
        },
        link() {
            if (this.linkSlug) {
                return {
                    ...this.$route,
                    query: {
                        ...this.$route.query,
                        [this.dimension]: this.linkSlug
                    }
                }
            } else {
                return {
                    ...this.$route,
                    query: _omit(this.$route.query, [this.dimension])
                }
            }
        }
    }
}
</script>
