<template>
    <div class="artist-gallery-item wiv" v-in-view>
        <video-block v-if="hasVideo" :embed="video" :placeholder="imageSrc" />
        <no-ssr v-else>
            <div
                class="placeholder"
                slot="placeholder"
                :style="{ 'padding-bottom': `${ratio}%` }"
            />
            <transition name="fade" appear>
                <responsive-image
                    v-if="imageObject"
                    class="gallery-item"
                    :object="imageObject"
                />
            </transition>
        </no-ssr>
    </div>
</template>

<script>
import _get from 'lodash/get'

export default {
    props: {
        item: {
            type: Object,
            required: true
        }
    },
    computed: {
        imageObject() {
            if (_get(this.item, 'item_image.id')) {
                return this.$options.filters.prisToRezImg(this.item.item_image)
            }
            if (_get(this.item, 'image.url')) {
                return {
                    sizes: {
                        fullscreen: {
                            url: this.item.image.url,
                            height: Number(this.item.image.height),
                            width: Number(this.item.image.width)
                        }
                    }
                }
            }
            return null
        },
        imageSrc() {
            return _get(this.imageObject, 'sizes.fullscreen.url')
        },
        ratio() {
            const height = _get(this.imageObject, 'sizes.fullscreen.height')
            const width = _get(this.imageObject, 'sizes.fullscreen.width')
            return height && width ? (height / width) * 100 : 56.25
        },
        video() {
            return _get(this.item, 'video')
        },
        hasVideo() {
            return this.video && this.video.html
        }
    }
}
</script>

<style lang="scss">
@import '../assets/scss/vars';

.artist-gallery-item {
    .video-block {
        margin-top: 120px;
    }
}
</style>
