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
            <img v-if="svgUrl" :src="svgUrl" :alt="title" class="svg-title" />
            <h2 v-else class="title">{{ title }}</h2>
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
        },
        svgUrl() {
            return _get(this.fields, 'svg-title.url')
        }
    }
}
</script>

<style lang="scss">
@import '../assets/scss/vars';

.feature-cover {
    .cover-meta {
        box-sizing: border-box;
        width: 100%;
    }
    .cover-meta .subtext,
    .cover-meta .title {
        max-width: 720px;
        margin: auto;
    }
    .cover-meta .svg-title {
        max-width: 445px;
        margin: auto;
        width: 60%;
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

// mobile breakpoints
@media #{ $lt-phone } {
    .feature-cover {
        justify-content: center;
        flex-direction: column;
        box-sizing: border-box;
        padding-top: 85px;

        .cover-image,
        .cover-meta {
            flex: initial;
            margin: 0;
        }
        &.format-split-left,
        &.format-split-right {
            .cover-image,
            .cover-meta {
                flex: initial;
                margin: 0;
            }
        }
        .cover-meta .svg-title {
            width: 100%;
        }

        &.format-split-left {
            margin-right: $mobile-padding;
            margin-left: $mobile-padding;
        }
        &.format-split-right {
            margin-right: $mobile-padding;
            margin-left: $mobile-padding;
        }
    }
}
</style>
