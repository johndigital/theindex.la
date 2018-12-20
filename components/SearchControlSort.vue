<template>
    <div class="search-control-sort">
        <h4 class="section-title">Sort</h4>
        <ul class="filter-select">
            <li
                v-for="option in options"
                :class="{ 'item-active': isItemActive(option.slug) }"
            >
                <nuxt-link :to="getLink(option.slug)">{{
                    option.name
                }}</nuxt-link>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    data() {
        return {
            options: [
                { name: 'Name', slug: 'name' },
                { name: 'Latest', slug: 'latest' },
                { name: 'Location', slug: 'location' }
            ]
        }
    },
    methods: {
        getLink(slug) {
            return {
                ...this.$route,
                query: {
                    ...this.$route.query,
                    sort: slug
                }
            }
        },
        isItemActive(slug) {
            if (this.$route.query.sort) {
                return slug === this.$route.query.sort
            }
            return slug === 'latest'
        }
    }
}
</script>

<style lang="scss">
@import '../assets/scss/vars';

.search-control-sort {
    button {
        padding: 0;
    }
    a {
        text-decoration: none;
        color: $dark-gray;
    }
    .item-active a,
    a:hover {
        color: $black;
    }
    ul {
        list-style-type: none;
        padding: 0;
        margin: 0;
    }
    li {
        position: relative;
    }
    .item-active::before {
        background-color: $black;
        border-radius: 100%;
        position: absolute;
        content: '';
        right: calc(100% + 10px);
        margin: auto;
        height: 6px;
        width: 6px;
        bottom: 0;
        top: 0;
    }
}
</style>
