<template>
    <div class="video-block" :style="styles">
        <div class="fill" key="vid" v-html="iframe" />
        <transition name="fade">
            <div
                v-if="!activated"
                @click="onClick"
                key="placeholder"
                :style="placeholderStyles"
                class="video-placeholder"
            >
                <img
                    src="/images/playicon.png"
                    height="60px"
                    width="60px"
                    alt="play"
                    class="play-icon"
                />
            </div>
        </transition>
    </div>
</template>

<script>
import _get from 'lodash/get'
import parse from 'url-parse'

export default {
    props: {
        embed: {
            type: Object,
            default: () => ({})
        },
        placeholder: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            activated: false
        }
    },
    computed: {
        styles() {
            return {
                'padding-bottom': `${this.aspect}%`
            }
        },
        placeholderStyles() {
            const thumb = this.placeholder || _get(this.embed, 'thumbnail_url')
            if (!thumb) return {}
            return {
                'background-image': `url(${thumb})`
            }
        },
        aspect() {
            const height = _get(this.embed, 'thumbnail_height')
            const width = _get(this.embed, 'thumbnail_width')
            return height && width ? (height / width) * 100 : 56.25
        },
        iframe() {
            return _get(this.embed, 'html', '')
        },
        isYoutube() {
            return !!this.iframe.match(/youtube\.com/)
        },
        isVimeo() {
            return !!this.iframe.match(/vimeo\.com/)
        }
    },
    methods: {
        onClick() {
            this.activated = true
            if (this.$el && this.$el.querySelector) {
                const iframe = this.$el.querySelector('iframe')
                if (iframe) {
                    if (this.isYoutube) this.playYoutube(iframe)
                    else if (this.isVimeo) this.playVimeo(iframe)
                }
            }
        },
        playVimeo(iframe) {
            const winnow = iframe.contentWindow
            winnow.postMessage('{"method":"play"}', '*')
        },
        playYoutube(iframe) {
            const src = iframe.src
            const parsed = parse(src, true)
            parsed.set('query', {
                ...parsed.query,
                autoplay: 1
            })
            iframe.src = parsed.toString()
        }
    }
}
</script>

<style lang="scss">
@import '../assets/scss/vars';

.video-block {
    position: relative;

    .fill {
        @include fill;
    }
    .video-placeholder {
        background-color: $dark-gray;
        cursor: pointer;
        @include cover;
        @include fill;
        display: flex;

        img {
            margin: auto;
        }
    }
    iframe {
        height: 100%;
        width: 100%;
    }
}

// mobile breakpoints
@media #{ $lt-phone } {
    .video-block {
        margin-top: 60px;
    }
}
</style>
