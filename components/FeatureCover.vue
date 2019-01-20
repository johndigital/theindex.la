<template>
    <section :class="['feature-cover', `format-${format}`]">
        <no-ssr>
            <responsive-image
                class="cover-image"
                :object="image | prisToRezImg"
                :fill-space="isFullbleed"
            />
        </no-ssr>
        <div class="cover-meta">
            <div class="subtext">{{ credits }}</div>
            <h2 class="title">{{ title }}</h2>
        </div>
    </section>
</template>

<script>
import _get from 'lodash/get'

export default {
    props: {
        fields: {
            type: Object,
            required: true
        }
    },
    computed: {
        isFullbleed() {
            return this.format === 'fullbleed'
        },
        format() {
            return _get(this.fields, 'style') || 'fullbleed'
        },
        credits() {
            return _get(this.fields, 'credits')
        },
        title() {
            const title = _get(this.fields, 'title')
            return this.$options.filters.prismicText(title)
        },
        image() {
            return _get(this.fields, 'image')
        }
    }
}
</script>

<style lang="scss">
@import '../assets/scss/vars';

.feature-cover {
    .cover-meta {
        max-width: 720px;
        margin: auto;
    }

    &.format-split-left {
        margin-right: $desktop-padding;
        margin-left: $desktop-padding;

        .cover-image,
        .cover-meta {
            flex: 1;
        }
        .cover-image {
            margin-bottom: auto;
            margin-top: auto;
        }
    }
    &.format-split-right {
        margin-right: $desktop-padding;
        margin-left: $desktop-padding;

        .cover-image,
        .cover-meta {
            flex: 1;
        }
        .cover-image {
            margin-bottom: auto;
            margin-top: auto;
            order: 2;
        }
    }
}
</style>
