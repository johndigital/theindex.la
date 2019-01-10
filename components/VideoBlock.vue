<template>
    <div class="video-block" :style="styles">
        <transition name="fade">
            <div
                v-if="iframe && activated"
                class="fill"
                key="vid"
                v-html="iframe"
            />
            <div
                v-else
                @click="activated = true"
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

export default {
    props: {
        embed: {
            type: Object,
            default: () => ({})
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
            const thumb = _get(this.embed, 'thumbnail_url')
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
        }
    }
}
</script>

<style lang="scss">
@import '../assets/scss/vars';

.video-block {
    position: relative;
    margin-top: 240px;

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
</style>
