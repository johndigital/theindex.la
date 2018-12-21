<template>
    <main class="artist-detail"></main>
</template>

<script>
import { fetchByType } from '~/libs/prismic'
import _get from 'lodash/get'

export default {
    async fetch({ store, params, query }) {
        const artist = await fetchByType({
            type: 'artist',
            slug: params.slug
        })

        if (artist) {
            return store.commit('SET_PAGE_DATA', {
                key: `artist/${params.slug}`,
                data: artist
            })
        }
    },
    computed: {
        pageData() {
            const slug = this.$route.params.slug
            return _get(this.$store.state, `pageData[artist/${slug}]`)
        }
    }
}
</script>

<style lang="scss">
@import '../../assets/scss/vars';

.artist-detail {
}
</style>
