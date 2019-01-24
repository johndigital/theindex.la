<template>
    <div class="story-splash" :style="styles">
        <!-- background img -->
        <no-ssr>
            <transition name="fade" appear>
                <responsive-image
                    v-if="bgImage && bgImage.url"
                    :object="bgImage | prisToRezImg"
                    fill-space
                />
            </transition>
        </no-ssr>
        <!-- <img
            v-if="bgImage && bgImage.url"
            :src="bgImage.url"
            style="display: none;"
        /> -->

        <!-- meta -->
        <div class="before-text">
            <prismic-content class="entry" :content="beforeContent" />
        </div>
        <div v-if="fgImageUrl" class="fg-image">
            <img :src="fgImageUrl" alt="" />
        </div>
        <div class="after-text">
            <prismic-content class="entry" :content="afterContent" />
        </div>
    </div>
</template>

<script>
import _get from 'lodash/get'

export default {
    computed: {
        pageData() {
            return _get(
                this.$store.state.pageData,
                `features/${this.$route.params.slug}`
            )
        },
        bgImage() {
            return _get(this.pageData, 'data.takeover_bg_image')
        },
        bgColor() {
            return _get(this.pageData, 'data.takeover_bg_color') || '#FFFFFF'
        },
        textColor() {
            return _get(this.pageData, 'data.takeover_text_color') || '#000000'
        },
        fgImageUrl() {
            return _get(this.pageData, 'data.takeover_fg_image.url')
        },
        beforeContent() {
            return _get(this.pageData, 'data.takeover_content_before')
        },
        afterContent() {
            return _get(this.pageData, 'data.takeover_content_after')
        },
        styles() {
            return {
                backgroundColor: this.bgColor,
                color: this.textColor
            }
        }
    }
}
</script>

<style lang="scss">
@import '../assets/scss/vars';

.story-splash {
    @include fill;
    flex-direction: column;
    display: flex;

    .entry {
        text-align: center;
        width: 100%;

        & > *:first-child {
            margin-top: 0;
        }
        & > *:last-child {
            margin-bottom: 0;
        }
        p,
        h3,
        h4 {
            margin: 20px 0;
        }
        h3 {
            font-size: 40px;
        }
        h4 {
            font-size: 32px;
        }
        a {
            text-decoration: underline;
            color: inherit;
        }
    }
    .fg-image,
    .before-text,
    .after-text {
        position: relative;
        max-width: 445px;
        width: 60%;
        margin: 10px auto;
    }
    .before-text,
    .after-text {
        display: flex;
        flex: 1;
    }
    .before-text .entry {
        margin-top: auto;
    }
    img {
        width: 100%;
    }
}
</style>
