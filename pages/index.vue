<template>
    <main class="front-page">
        <transition name="fade" mode="out-in">
            <div :class="innerClasses" :key="$store.state.gridView">
                <div class="artist-grid">
                    <artist-row
                        v-for="(artist, i) in artists"
                        :artist="artist"
                        :key="i"
                    />
                </div>
            </div>
        </transition>
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

    // grid mode
    .is-grid-view .artist-grid {
        padding-right: $desktop-padding;
        padding-left: $desktop-padding;
        flex-wrap: wrap;
        display: flex;
    }
}
</style>
