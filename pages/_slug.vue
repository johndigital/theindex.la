<template>
    <main class="single-page">
        <div class="inner">
            <prismic-content class="entry" :content="content" />
            <footer class="footer">{{ footerText }}</footer>
        </div>
    </main>
</template>

<script>
import { fetchByType } from '~/libs/prismic'
import _get from 'lodash/get'

export default {
    async fetch({ store, params, query }) {
        const page = await fetchByType({
            type: 'page',
            slug: params.slug
        })

        if (page) {
            store.commit('SET_PAGE_DATA', {
                key: `pages/${params.slug}`,
                data: page
            })
        }
    },
    computed: {
        pageData() {
            return _get(
                this.$store.state,
                `pageData[pages/${this.$route.params.slug}]`
            )
        },
        content() {
            return _get(this.pageData, 'data.content')
        },
        footerText() {
            return _get(this.pageData, 'data.footer_text')
        }
    }
}
</script>

<style lang="scss">
@import '../assets/scss/vars';

.single-page {
    .inner {
        padding: $header-height $desktop-padding 0;
        justify-content: center;
        flex-direction: column;
        box-sizing: border-box;
        min-height: 100vh;
        display: flex;
    }
    .entry {
        max-width: 850px;
        padding: 60px 0;
    }
    .entry,
    .footer {
        margin-top: auto;
    }
    .footer {
        justify-self: flex-end;
        padding-bottom: 60px;
        color: $dark-gray;
        font-size: 16px;
    }
}
</style>
