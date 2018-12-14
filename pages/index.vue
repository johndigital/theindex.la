<template>
    <main class="front-page"><div class="inner">Front Page</div></main>
</template>

<script>
// import prismic from '~/libs/prismic'
// import _first from 'lodash/first'
// import _get from 'lodash/get'

export default {
    // async fetch({ store, params }) {
    //     const api = await prismic
    //     const { results } = await api.query('[at(document.type, "front_page")]')
    //     return store.commit('SET_PAGE_DATA', {
    //         key: 'front_page',
    //         data: _first(results)
    //     })
    // }
}
</script>

<style lang="scss">
@import '../assets/scss/vars';

main.front-page {
    .inner {
        background-color: #f1f1f1;
        margin: 100px $desktop-padding 50px;
    }
}
</style>
