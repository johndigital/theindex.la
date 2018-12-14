<template>
    <div
        class="prismic-content"
        v-if="content && content.length"
        v-html="formattedContent"
    />
</template>

<script>
import linkResolver from '~/libs/prismic/linkResolver'
// import prismic from '~/libs/prismic'
import PrismicDOM from 'prismic-dom'

export default {
    props: {
        content: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        formattedContent() {
            return PrismicDOM.RichText.asHtml(this.content, linkResolver) || ''
        }
    }
}
</script>
