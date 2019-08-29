<template>
    <div :class="['bs-text', 'wiv', `align-${alignment}`]" v-in-view>
        <div class="text-inner entry" v-html="content" />
    </div>
</template>

<script>
import _kebabCase from 'lodash/kebabCase'
import _get from 'lodash/get'

export default {
    props: {
        section: {
            type: Object,
            required: true
        }
    },
    computed: {
        content() {
            const content = _get(this.section, 'primary.text', '')
            return this.$options.filters.prismicHtml(content)
        },
        alignment() {
            return _kebabCase(_get(this.section, 'primary.alignment', 'left'))
        }
    }
}
</script>

<style lang="scss">
@import '../../assets/scss/vars';

.bs-text {
    margin-top: 240px;

    .text-inner {
        padding-right: $desktop-padding;
        padding-left: $desktop-padding;
        max-width: 780px;
        margin: auto;
    }

    &.align-center .entry {
        text-align: center;
    }
    &.align-right .entry {
        text-align: right;
    }

    .entry {
        line-height: 2;
        color: inherit;

        h3 + p,
        h4 + p,
        h5 + p {
            margin-top: 0;
        }
        p {
            margin-bottom: 60px;
            margin-top: 60px;
        }
        h4 {
            font-size: 28px;
        }
        a {
            color: var(--article-link-color);

            &:hover {
                color: inherit;
            }
        }
    }
}

// mobile breakpoints
@media #{ $lt-phone } {
    .bs-text {
        margin-top: 60px;

        .text-inner {
            padding-right: $mobile-padding;
            padding-left: $mobile-padding;
        }
        .entry {
            h4 {
                font-size: 22px;
            }
        }
    }
}
</style>
