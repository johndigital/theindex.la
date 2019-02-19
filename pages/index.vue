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
        <div class="loading-area">
            <transition name="fade">
                <loading-spinner v-if="loadingData" />
            </transition>
        </div>
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
            pageSize: 50,
            page: 1
        })

        return store.commit('SET_PAGE_DATA', {
            key: `artists/page/1`,
            data: artists
        })
    },
    watch: {
        '$route.query'() {
            this.reachedEnd = false
            this.page = 1
        },
        atBottom: 'loadNextPage'
    },
    data() {
        return {
            loadingData: false,
            reachedEnd: false,
            timer: null,
            page: 1
        }
    },
    computed: {
        innerClasses() {
            return [
                'inner',
                { 'is-grid-view': this.$store.state.gridView },
                { 'is-list-view': !this.$store.state.gridView }
            ]
        },
        atBottom() {
            const { winHeight, docHeight, sTop } = this.$store.state.browser
            return sTop + winHeight > docHeight - 300
        },
        artists() {
            let artists = []
            for (let i = 1; i <= this.page; i++) {
                const pageItems = _get(
                    this.$store.state,
                    `pageData[artists/page/${i}]`,
                    []
                )
                artists = artists.concat(pageItems)
            }
            return artists
        }
    },
    methods: {
        async loadNextPage() {
            clearTimeout(this.timer)
            await this.$nextTick()
            if (this.atBottom && !this.loadingData && !this.reachedEnd) {
                this.loadingData = true

                // set next page and run query
                const nextPage = this.page + 1
                const artists = await fetchByQs({
                    query: this.$route.query,
                    store: this.$store,
                    pageSize: 50,
                    page: nextPage
                })

                // only if we have results...
                if (artists.length) {
                    // commit to store
                    this.$store.commit('SET_PAGE_DATA', {
                        key: `artists/page/${nextPage}`,
                        data: artists
                    })

                    // increment page
                    this.page = this.page + 1
                } else {
                    this.reachedEnd = true
                }

                // set not loading, and set a timer to run again
                setTimeout(this.loadNextPage, 3500)
                this.loadingData = false
            }
        }
    }
}
</script>

<style lang="scss">
@import '../assets/scss/vars';

main.front-page {
    .inner {
        padding-top: 90px;
        position: relative;
    }

    // no results
    .no-results {
        padding-right: $desktop-padding;
        padding-left: $desktop-padding;
        padding-top: 60px;
        font-size: 28px;
    }

    // loading
    .loading-area {
        text-align: center;
        padding-top: 0;
        padding: 60px;
        height: 60px;
    }

    // grid mode
    .is-grid-view .artist-grid {
        padding-right: $desktop-padding;
        padding-left: $desktop-padding;
        flex-wrap: wrap;
        display: flex;
    }
}

// mobile breakpoints
@media #{ $lt-phone } {
    main.front-page {
        .inner {
            padding-top: 85px;
        }
        .no-results {
            padding-right: $mobile-padding;
            padding-left: $mobile-padding;
            text-align: center;
        }
        .loading-spinner {
            height: 25px;
            width: 25px;
        }
        .loading-area {
            padding-right: $mobile-padding;
            padding-left: $mobile-padding;
            padding-bottom: 30px;
            padding-top: 30px;
        }
    }
}
</style>
