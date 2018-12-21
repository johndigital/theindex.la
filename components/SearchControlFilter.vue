<template>
    <div class="search-control-filter">
        <h4 class="section-title">{{ title }}</h4>
        <ul class="filter-select">
            <li v-for="option in filterOptions">
                <search-control-filter-option
                    :option="option"
                    :dimension="dimension"
                />
            </li>
        </ul>
    </div>
</template>

<script>
import _get from 'lodash/get'

export default {
    props: {
        title: {
            type: String,
            default: ''
        },
        dimension: {
            type: String,
            required: true
        }
    },
    computed: {
        filterOptions() {
            return _get(this.$store.state.pageData, `all-${this.dimension}`, [])
        }
    }
}
</script>

<style lang="scss">
@import '../assets/scss/vars';

.search-control-filter {
}
</style>
