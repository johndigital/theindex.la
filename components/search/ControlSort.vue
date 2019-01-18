<template>
    <div class="search-control-sort">
        <h4 class="section-title">Sort</h4>
        <ul class="filter-select">
            <li v-for="option in options">
                <nuxt-link
                    :to="getLink(option.slug)"
                    :class="{ 'item-active': isItemActive(option.slug) }"
                    >{{ option.name }}</nuxt-link
                >
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
                { name: 'Latest', slug: 'latest' }
                // { name: 'Location', slug: 'location' }
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
@import '../../assets/scss/vars';

.search-control-sort {
}
</style>
