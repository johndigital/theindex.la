<template>
    <no-ssr>
        <div
            v-if="padding"
            :style="{ paddingBottom: `${padding}%` }"
            class="prismic-image-placeholder"
            slot="placeholder"
        >
            <!-- <responsive-image 
                v-if="image"
                v-bind="bindProps"
                :object="image | prisToRezImg"
                :fillSpace="fillSpace"
                :aspect="aspect"
                color="#f1f1f1"
                :fit="fit"
            >
                <slot />
            </responsive-image> -->
        </div>
    </no-ssr>
</template>

<script>
import _get from 'lodash/get'

export default {
    props: {
        image: {
            type: [Object, Boolean],
            default: false
        },
        aspect: [Number, String],
        videoSrc: {
            type: String,
            default: undefined
        },
        fillSpace: {
            type: Boolean,
            default: false
        },
        fit: String
    },
    computed: {
        padding() {
            if (this.aspect) return this.aspect
            const { width, height } = _get(this.image, 'dimensions', {})
            if (width && height) return (height / width) * 100
            return 0
        },
        bindProps() {
            return {
                ...(this.videoSrc ? { videoSrc: this.videoSrc } : {})
            }
        }
    }
}
</script>

<style lang="scss">
@import '../../assets/scss/vars';

.prismic-image-placeholder {
    height: 0;
}
</style>
