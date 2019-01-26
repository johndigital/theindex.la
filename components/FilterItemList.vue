<template>
    <transition name="fade">
        <div class="filter-item-list" v-if="!$store.state.sidebarOpen">
            <div class="filter-item" v-for="item in filterItems">
                <search-control-filter-option
                    :dimension="item.dimension"
                    :option="item.item"
                />
                <span class="plus">+</span>
            </div>
        </div>
    </transition>
</template>

<script>
import _omit from 'lodash/omit'
import _get from 'lodash/get'

export default {
    computed: {
        filterItems() {
            const items = []
            Object.keys(this.$route.query).forEach(key => {
                const slugs = String(this.$route.query[key]).split(',')
                const allItems = _get(
                    this.$store.state,
                    `pageData[all-${key}]`,
                    []
                )

                // loop slugs
                slugs.forEach(slug => {
                    const thisItem = allItems.find(item => {
                        return _get(item, 'slugs[0]') == slug
                    })

                    // if valid, push to list
                    if (thisItem) {
                        items.push({
                            dimension: key,
                            item: thisItem
                        })
                    }
                })
            })

            return items
        }
    }
}
</script>

<style lang="scss">
@import '../assets/scss/vars';

.filter-item-list {
    color: $dark-gray;

    .filter-item {
        display: inline-block;

        a,
        .plus {
            display: inline;
        }
    }
    .filter-item a {
        text-decoration: none;
        color: $dark-gray;

        &:hover {
            color: $black;
        }
    }
    .filter-item:last-child .plus {
        display: none;
    }
    .plus {
        margin: 0 4px;
    }
}
</style>
