<template>
    <aside :class="['site-sidebar', { 'many-filters': hasManyFilters }]">
        <div class="scroll-wrap">
            <div class="inner-sidebar">
                <search-field />
                <search-control-sort />
                <search-control-filter title="Type" dimension="type" />
                <search-control-filter title="Category" dimension="category" />
                <search-control-filter title="Location" dimension="region" />
            </div>
        </div>
        <div class="clear-filters">
            <nuxt-link class="button" :to="clearLink">Clear all</nuxt-link>
        </div>
    </aside>
</template>

<script>
export default {
    watch: {
        '$route.name'() {
            this.$store.commit('CLOSE_SIDEBAR')
        }
    },
    computed: {
        clearLink() {
            return {
                ...this.$route,
                query: {}
            }
        },
        hasManyFilters() {
            const items = Object.keys(this.$route.query).reduce((acc, key) => {
                const split = String(this.$route.query[key]).split(',')
                return acc.concat(split)
            }, [])

            return items.length > 1
        }
    }
}
</script>

<style lang="scss">
@import '../assets/scss/vars';

.site-sidebar {
    transition: transform 400ms $easeInOutQuad;
    border-right: 1px solid $mid-gray;
    background-color: $light-gray;
    transform: translateX(-100%);
    box-sizing: border-box;
    position: fixed;
    width: 320px;
    bottom: 0;
    left: 0;
    top: 0;

    .scroll-wrap {
        @include fill;
        overflow: auto;
    }
    .inner-sidebar {
        padding: 30px 60px 150px;
    }

    .search-control-sort {
        margin-top: 90px;
    }
    .search-control-filter {
        margin-top: 60px;
    }

    .sidebar-open & {
        transform: none;
    }

    // list select styling
    .filter-select {
        list-style-type: none;
        padding: 0;
        margin: 0;
        margin-top: 20px;

        button {
            padding: 0;
        }
        a {
            text-decoration: none;
            color: $dark-gray;
        }
        a.nuxt-link-exact-active,
        a.item-active,
        a:hover {
            color: $black;
        }
        li {
            position: relative;
        }
        .nuxt-link-exact-active::before,
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

    // button to clear filters
    .clear-filters {
        transition: transform 450ms;
        background-color: $white;
        position: absolute;
        top: 100%;
        right: 0;
        left: 0;

        .button {
            box-sizing: border-box;
            text-decoration: none;
            padding: 30px 60px;
            text-align: left;
            display: block;
            width: 100%;
        }
    }
    &.many-filters .clear-filters {
        transform: translateY(-100%);
    }
}
</style>
