<template>
    <div class="bs-video-embed">
        <video-block :embed="embed" :placeholder="placeholder" />
    </div>
</template>

<script>
import _get from 'lodash/get'

export default {
    props: {
        section: {
            type: Object,
            required: true
        }
    },
    computed: {
        embed() {
            return _get(this.section, 'primary.video_url')
        },
        placeholder() {
            return _get(this.section, 'primary.placeholder_image.url')
        }
    }
}
</script>

<style lang="scss">
@import '../../assets/scss/vars';

.bs-video-embed {
    padding-right: $desktop-padding;
    padding-left: $desktop-padding;
    max-width: 960px;
    margin: auto;
}

// mobile breakpoints
@media #{ $lt-phone } {
    .bs-video-embed {
        padding-right: $mobile-padding;
        padding-left: $mobile-padding;
    }
}
</style>
