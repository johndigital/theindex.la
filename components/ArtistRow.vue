<template>
    <div class="artist-row">
        <div class="column image">
            <no-ssr>
                <a-div :href="artist | prismicLink">
                    <responsive-image
                        :object="image | prisToRezImg"
                        :aspect="100"
                        fit="contain"
                    />
                </a-div>
            </no-ssr>
        </div>
        <div class="column name">
            <h3 class="title">
                <a-div :href="artist | prismicLink">{{ title }}</a-div>
            </h3>
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
    </div>
</template>

<script>
import _get from 'lodash/get'

export default {
    props: {
        artist: {
            type: Object,
            required: true
        }
    },
    computed: {
        image() {
            return _get(this.artist, 'data.featureImage')
        },
        title() {
            return _get(this.artist, 'data.name')
        },
        types() {
            const artistTypes = _get(this.artist, 'data.types', []).map(
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
            const artistCats = _get(this.artist, 'data.categories', []).map(
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
                    return city.id === _get(this.artist, 'data.city.id')
                }
            )
            if (!city) return false
            return {
                name: _get(city, 'data.name', ''),
                link: this.$options.filters.prismicLink(city)
            }
        }
    }
}
</script>

<style lang="scss">
@import '../assets/scss/vars';

.artist-row {
    grid-template-columns: 24% repeat(3, 1fr);
    grid-gap: 60px;
    border-top: 1px solid $mid-gray;
    display: grid;
    padding: 60px $desktop-padding;
    color: $dark-gray;

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
    h3 {
        font-size: 100%;

        a {
            color: $black;
            display: block;
        }
    }
    .image {
        position: relative;
    }
    .column {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    // grid view
    .is-grid-view & {
        text-align: center;
        overflow: hidden;
        padding-right: 0;
        padding-left: 0;
        border-top: none;
        display: block;
        width: 50%;

        .categories,
        .city {
            display: none;
        }
        .image {
            width: calc(100% - 60px);
            margin: auto;
        }
        .title a {
            padding-top: 30px;
        }
        .types li {
            display: inline-block;

            &::after {
                content: '/';
                margin: 0 5px;
            }
            &:last-child::after {
                display: none;
            }
        }
    }
}
</style>
