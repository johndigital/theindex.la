<template>
    <main class="artist-detail">
        <div class="artist-info">
            <div class="column name">
                <h3 class="title">{{ title }}</h3>
                <ul class="types">
                    <li v-for="type in types">
                        <nuxt-link :to="type.link">{{ type.name }}</nuxt-link>
                    </li>
                </ul>
            </div>
            <ul class="column categories">
                <li v-for="category in categories">
                    <a-div :href="category.link">{{ category.name }}</a-div>
                </li>
            </ul>
            <div class="column city">
                <a-div v-if="city" :href="city.link">{{ city.name }}</a-div>
            </div>
            <ul class="column socials">
                <li>
                    <a-div
                        v-if="siteLink"
                        target="_blank"
                        class="website"
                        :href="siteLink"
                        >Website</a-div
                    >
                </li>
                <li>
                    <a-div
                        v-if="igLink"
                        target="_blank"
                        class="instagram"
                        :href="igLink"
                        >Instagram</a-div
                    >
                </li>
            </ul>
        </div>

        <div class="artist-gallery">
            <no-ssr v-for="(item, i) in galleryItems" :key="i">
                <responsive-image
                    class="gallery-item"
                    :object="item.item_image | prisToRezImg"
                />
            </no-ssr>
        </div>

        <div class="related-section">
            <h3 class="related-title">Related Artists</h3>
            <div class="related-grid">
                <artist-row
                    v-for="(artist, i) in similarItems"
                    :artist="artist"
                    :key="i"
                />
            </div>
        </div>
    </main>
</template>

<script>
import { fetchByType, fetchSimilar } from '~/libs/prismic'
import _get from 'lodash/get'

export default {
    async fetch({ store, params, query }) {
        const artist = await fetchByType({
            type: 'artist',
            slug: params.slug
        })

        if (artist) {
            store.commit('SET_PAGE_DATA', {
                key: `artist/${params.slug}`,
                data: artist
            })

            // get similar
            const similar = await fetchByType({
                type: 'artist',
                pageSize: 6
            })
            store.commit('SET_PAGE_DATA', {
                key: `artist/${params.slug}/similar`,
                data: similar
            })
        }
    },
    computed: {
        pageData() {
            const slug = this.$route.params.slug
            return _get(this.$store.state, `pageData[artist/${slug}]`)
        },
        title() {
            return _get(this.pageData, 'data.name', '')
        },
        igLink() {
            return _get(this.pageData, 'data.instagram', '')
        },
        siteLink() {
            return _get(this.pageData, 'data.website', '')
        },
        types() {
            const artistTypes = _get(this.pageData, 'data.types', []).map(
                type => {
                    return _get(type, 'type.id')
                }
            )
            const types = _get(
                this.$store.state,
                'pageData.all-type',
                []
            ).filter(type => {
                return artistTypes.includes(type.id)
            })
            return types.map(type => {
                return {
                    name: _get(type, 'data.name', ''),
                    link: this.$options.filters.prismicLink(type)
                }
            })
        },
        categories() {
            const artistCats = _get(this.pageData, 'data.categories', []).map(
                cat => {
                    return _get(cat, 'category.id')
                }
            )
            const categories = _get(
                this.$store.state,
                'pageData.all-category',
                []
            ).filter(cat => {
                return artistCats.includes(cat.id)
            })
            return categories.map(cat => {
                return {
                    name: _get(cat, 'data.name', ''),
                    link: this.$options.filters.prismicLink(cat)
                }
            })
        },
        city() {
            const city = _get(this.$store.state, 'pageData.all-city', []).find(
                city => {
                    return city.id === _get(this.pageData, 'data.city.id')
                }
            )
            if (!city) return false
            return {
                name: _get(city, 'data.name', ''),
                link: this.$options.filters.prismicLink(city)
            }
        },
        galleryItems() {
            return _get(this.pageData, 'data.gallery', [])
        },
        similarItems() {
            const slug = this.$route.params.slug
            return _get(this.$store.state, `pageData[artist/${slug}/similar]`)
        }
    }
}
</script>

<style lang="scss">
@import '../../assets/scss/vars';

.artist-detail {
    padding-top: $header-height;

    .artist-info {
        position: fixed;
        justify-content: center;
        flex-direction: column;
        display: flex;
        width: 250px;
        bottom: 50px;
        left: $desktop-padding;
        top: $header-height;

        h3 {
            font-size: 100%;
        }
        ul {
            list-style-type: none;
            margin: 0;
            padding: 0;
        }
        a {
            text-decoration: none;
            color: $dark-gray;

            &:hover {
                color: $black;
            }
        }
        .column {
            margin-top: 30px;
        }
    }
    .artist-gallery {
        padding-left: $desktop-padding;
        padding-bottom: 240px;
        margin: auto;
        width: 40%;
    }
    .gallery-item {
        padding-bottom: 60px;
        padding-top: 60px;
    }

    .related-section {
        position: relative;
        background-color: $white;
    }
    .related-title {
        border-bottom: 1px solid $mid-gray;
        padding-right: $desktop-padding;
        padding-left: $desktop-padding;
        padding-bottom: 120px;
        margin-bottom: 60px;
        text-align: center;
        font-size: 32px;
    }
    .related-grid {
        padding-right: $desktop-padding;
        padding-left: $desktop-padding;
        flex-wrap: wrap;
        display: flex;
    }
}
</style>
