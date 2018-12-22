<template>
    <div class="story-row">
        <a-div class="image" :href="story | prismicLink">
            <no-ssr>
                <responsive-image :object="defaultImage | prisToRezImg" />
            </no-ssr>
            <div v-if="svgImage" class="svg-meta"><img :src="svgImage" /></div>
            <div v-else class="meta">
                <h4 class="story-credit">{{ credit }}</h4>
                <h3 class="story-title">{{ title | prismicText }}</h3>
            </div>
        </a-div>
    </div>
</template>

<script>
import _get from 'lodash/get'

export default {
    props: {
        story: {
            type: Object,
            required: true
        }
    },
    computed: {
        defaultImage() {
            return _get(this.story, 'data.grid[0].default-image')
        },
        credit() {
            return _get(this.story, 'data.cover[0].credits', '')
        },
        title() {
            return _get(this.story, 'data.cover[0].title', '')
        },
        svgImage() {
            return _get(this.story, 'data.cover[0].svg-title.url', '')
        }
    }
}
</script>

<style lang="scss">
@import '../assets/scss/vars';

.story-row {
    .image {
        position: relative;
        overflow: hidden;
        display: block;
        color: $white;
    }
    .meta {
        @include fill;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        display: flex;
        padding: 0 $desktop-padding;
        max-width: 600px;
        margin: auto;
    }
    .svg-meta {
        transform: translate(-50%, -50%);
        position: absolute;
        max-width: 445px;
        width: 60%;
        left: 50%;
        top: 50%;
    }
    .story-credit {
        font-size: 100%;
    }
    .story-title {
        margin-top: 20px;
        font-size: 40px;
    }
}
</style>
