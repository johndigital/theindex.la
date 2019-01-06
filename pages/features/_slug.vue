<template>
    <main class="feature-detail" :style="styles">
        <div v-if="hasCover" class="cover-section">
            <no-ssr>
                <responsive-image
                    :object="coverImage | prisToRezImg"
                    fill-space
                />
            </no-ssr>
        </div>
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
                backgroundColor: this.bgColor
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
        coverImage() {
            return _get(this.pageData, 'data.cover[0].image')
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
            return (
                _get(this.pageData, 'data.colors[0].borderColor') ||
                'transparent'
            )
        },
        borderColor() {
            return _get(this.pageData, 'data.colors[0].textColor') || '#000'
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

    .cover-section {
        position: relative;
        height: 100vh;
    }
}
</style>
