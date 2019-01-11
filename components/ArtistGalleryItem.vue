<template>
    <div class="artist-gallery-item">
        <no-ssr>
            <div
                class="placeholder"
                slot="placeholder"
                :style="{ 'padding-bottom': `${ratio}%` }"
            />
            <transition name="fade" appear>
                <responsive-image
                    class="gallery-item"
                    :object="item.item_image | prisToRezImg"
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
        ratio() {
            const height = _get(this.item, 'item_image.dimensions.height')
            const width = _get(this.item, 'item_image.dimensions.width')
            return height && width ? (height / width) * 100 : 56.25
        }
    }
}
</script>

<style lang="scss">
@import '../assets/scss/vars';

.artist-gallery-item {
}
</style>
