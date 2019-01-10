<template>
    <div class="video-block" :style="styles"></div>
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
    computed: {
        styles() {
            return {
                'padding-bottom': `${this.aspect}%`
            }
        },
        aspect() {
            const height = _get(this.embed, 'thumbnail_height')
            const width = _get(this.embed, 'thumbnail_width')
            return height && width ? (height / width) * 100 : 56.25
        }
    }
}
</script>

<style lang="scss">
@import '../assets/scss/vars';

.video-block {
}
</style>
