<template>
    <main class="feature-detail" :style="styles">
        <feature-cover v-if="hasCover" :fields="coverData" />
        <div class="body-sections">
            <component
                v-for="(section, i) in bodySections"
                :is="`body-section-${section.slice_type}`"
                :section="section"
                :key="i"
            />
        </div>
        <nuxt-link
            v-if="nextStory"
            :to="nextStory | prismicLink"
            class="next-story"
            :style="nextStyles"
        >
            <span>Next Story</span>
        </nuxt-link>
        <nuxt-link
            v-else
            to="../"
            append
            class="next-story"
            :style="nextStyles"
        >
            <span>All Stories</span>
        </nuxt-link>
    </main>
</template>

<script>
import { fetchByType, fetchNextDocument } from '~/libs/prismic'
import _get from 'lodash/get'

export default {
    async fetch({ store, params, query }) {
        const story = await fetchByType({
            type: 'feature',
            slug: params.slug
        })

        if (story) {
            // add to vuex
            store.commit('SET_PAGE_DATA', {
                key: `features/${params.slug}`,
                data: story
            })

            // attempt to fetch next in order
            const nextStory = await fetchNextDocument({
                type: 'feature',
                doc: story
            })

            // if success getting next story,
            // add to vuex
            if (nextStory) {
                store.commit('SET_PAGE_DATA', {
                    key: `features/${params.slug}/next`,
                    data: nextStory
                })
            }
        }
    },
    computed: {
        styles() {
            return {
                backgroundColor: this.bgColor,
                color: this.textColor
            }
        },
        pageData() {
            return _get(
                this.$store.state.pageData,
                `features/${this.$route.params.slug}`
            )
        },
        coverData() {
            return _get(this.pageData, 'data.cover[0]')
        },
        bodySections() {
            return _get(this.pageData, 'data.body', [])
        },
        hasCover() {
            return !!(
                this.coverData &&
                this.coverData.credits &&
                this.coverData.image.url
            )
        },
        nextStory() {
            return _get(
                this.$store.state.pageData,
                `features/${this.$route.params.slug}/next`
            )
        },
        bgColor() {
            return (
                _get(this.pageData, 'data.colors[0].backgroundColor') || '#FFF'
            )
        },
        textColor() {
            return _get(this.pageData, 'data.colors[0].textColor') || '#000'
        },
        borderColor() {
            return (
                _get(this.pageData, 'data.colors[0].borderColor') ||
                'transparent'
            )
        },
        nextStyles() {
            return {
                borderColor: this.textColor
            }
        }
    }
}
</script>

<style lang="scss">
@import '../../assets/scss/vars';

.route-stories-slug .site-header {
    background-color: transparent;
}
.feature-detail {
    overflow: hidden;
    min-height: 100vh;

    a {
        color: inherit;
    }
    .feature-cover {
        position: relative;
        height: 100vh;
        display: flex;
    }
    .cover-meta {
        text-align: center;
        position: relative;
        padding: 50px;
        margin: auto;

        .title {
            margin-top: 20px;
            font-size: 40px;
        }
    }
    .body-sections {
        overflow: hidden;
    }
    .next-story {
        padding: 240px $desktop-padding;
        border-top: 1px solid;
        text-decoration: none;
        text-align: center;
        margin-top: 240px;
        font-size: 32px;
        display: block;
    }
}
</style>
