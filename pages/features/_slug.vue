<template>
    <main class="feature-detail" :style="styles">
        <div v-if="hasCover" class="cover-section">
            <no-ssr>
                <responsive-image
                    :object="coverImage | prisToRezImg"
                    fill-space
                />
            </no-ssr>
            <div class="cover-meta">
                <div class="subtext">{{ coverCredits }}</div>
                <h2 class="title">{{ coverTitle }}</h2>
            </div>
        </div>
        <div class="body-sections">
            <component
                v-for="(section, i) in bodySections"
                :is="`body-section-${section.slice_type}`"
                :section="section"
                :key="i"
            />
        </div>
        <nuxt-link to="/" class="next-story" :style="nextStyles">
            <span>Next Story</span>
        </nuxt-link>
    </main>
</template>

<script>
import { fetchByType } from '~/libs/prismic'
import _get from 'lodash/get'

export default {
    async fetch({ store, params, query }) {
        const story = await fetchByType({
            type: 'feature',
            slug: params.slug
        })

        if (story) {
            store.commit('SET_PAGE_DATA', {
                key: `features/${params.slug}`,
                data: story
            })
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
        coverCredits() {
            return _get(this.pageData, 'data.cover[0].credits')
        },
        coverTitle() {
            const title = _get(this.pageData, 'data.cover[0].title')
            return this.$options.filters.prismicText(title)
        },
        coverImage() {
            return _get(this.pageData, 'data.cover[0].image')
        },
        bodySections() {
            return _get(this.pageData, 'data.body', [])
        },
        hasCover() {
            return !!(
                this.coverCredits &&
                this.coverImage &&
                this.coverImage.url
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
                borderColor: this.borderColor
            }
        }
    }
}
</script>

<style lang="scss">
@import '../../assets/scss/vars';

.route-features-slug .site-header {
    background-color: transparent;
}
.feature-detail {
    min-height: 100vh;

    a {
        color: inherit;
    }
    .cover-section {
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
    .next-story {
        padding: 240px $desktop-padding;
        border-top: 1px solid;
        text-decoration: none;
        text-align: center;
        font-size: 32px;
        display: block;
    }
}
</style>
