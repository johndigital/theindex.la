<template>
    <div class="artist-row">
        <div class="column image">
            <no-ssr>
                <responsive-image
                    :object="image | prisToRezImg"
                    :aspect="100"
                    fit="contain"
                />
            </no-ssr>
        </div>
        <div class="column name"></div>
        <div class="column categories"></div>
        <div class="column location"></div>
    </div>
</template>

<script>
import _get from 'lodash/get'

export default {
    props: {
        artist: {
            type: Object,
            required: true
        }
    },
    computed: {
        image() {
            return _get(this.artist, 'data.featureImage')
        }
    }
}
</script>

<style lang="scss">
@import '../assets/scss/vars';

.artist-row {
    grid-template-columns: repeat(4, 1fr);
    display: grid;

    .image {
        position: relative;
    }
}
</style>
