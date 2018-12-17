<template>
    <main class="front-page">
        <div class="inner">
            <div class="artist-grid">
                <artist-row
                    v-for="(artist, i) in artists"
                    :artist="artist"
                    :key="i"
                />
            </div>
        </div>
    </main>
</template>

<script>
import { fetchByType } from '~/libs/prismic'
import _get from 'lodash/get'

export default {
    async fetch({ store, params }) {
        const artists = await fetchByType({
            type: 'artist',
            orderings: '[my.artist.order desc]',
            pageSize: 20
        })

        return store.commit('SET_PAGE_DATA', {
            key: 'artists',
            data: artists
        })
    },
    computed: {
        artists() {
            return _get(this.$store.state, 'pageData.artists', [])
        }
    }
}
</script>

<style lang="scss">
@import '../assets/scss/vars';

main.front-page {
    .inner {
        margin: 100px $desktop-padding 50px;
        position: relative;
    }
}
</style>
