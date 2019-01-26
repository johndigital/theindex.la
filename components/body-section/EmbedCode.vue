<template>
    <div class="bs-embed-code wiv" v-in-view>
        <div class="iframe" v-html="html" />
    </div>
</template>

<script>
import _get from 'lodash/get'

export default {
    props: {
        section: {
            type: Object,
            required: true
        }
    },
    computed: {
        html() {
            const embedTextData = _get(this.section, 'primary.embed_code')
            return this.$options.filters.prismicText(embedTextData)
        }
    }
}
</script>

<style lang="scss">
@import '../../assets/scss/vars';

.bs-embed-code {
    margin-top: 240px;

    .iframe {
        padding-right: 110px;
        padding-left: 110px;
        max-width: 960px;
        margin: auto;
    }
}

// mobile breakpoints
@media #{ $lt-phone } {
    .bs-embed-code {
        margin-top: 60px;

        .iframe {
            padding-right: $mobile-padding;
            padding-left: $mobile-padding;
        }
    }
}
</style>
