<template>
    <main class="front-page">
        <transition name="fade" mode="out-in">
            <div :class="innerClasses" :key="$store.state.gridView">
                <div v-if="artists.length" class="artist-grid">
                    <artist-row
                        v-for="(artist, i) in artists"
                        :artist="artist"
                        :key="i"
                    />
                </div>
                <div v-else class="no-results">No Artists</div>
            </div>
        </transition>
    </main>
</template>

<script>
import { fetchByQs } from '~/libs/prismic'
import _get from 'lodash/get'

export default {
    watchQuery: true,
    async fetch({ store, params, query }) {
        const artists = await fetchByQs({
            query,
            store,
            pageSize: 20
        })

        return store.commit('SET_PAGE_DATA', {
            key: 'artists',
            data: artists
        })
    },
    computed: {
        innerClasses() {
            return [
                'inner',
                { 'is-grid-view': this.$store.state.gridView },
                { 'is-list-view': !this.$store.state.gridView }
            ]
        },
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
        padding: 90px 0 50px;
        position: relative;
    }

    // no results
    .no-results {
        padding-right: $desktop-padding;
        padding-left: $desktop-padding;
        padding-top: 60px;
        font-size: 28px;
    }

    // grid mode
    .is-grid-view .artist-grid {
        padding-right: $desktop-padding;
        padding-left: $desktop-padding;
        flex-wrap: wrap;
        display: flex;
    }
}
</style>
