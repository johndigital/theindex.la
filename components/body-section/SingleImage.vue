<template>
    <div :class="classes">
        <no-ssr
            ><responsive-image class="image" :object="image | prisToRezImg"
        /></no-ssr>
        <div class="block-meta"></div>
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
        classes() {
            return [
                'bs-single-image',
                `position-${this.position}`,
                `format-${this.style}`
            ]
        },
        position() {
            return _get(this.section, 'value[0].position')
        },
        style() {
            return _get(this.section, 'value[0].style')
        },
        image() {
            return _get(this.section, 'value[0].image')
        }
    }
}
</script>

<style lang="scss">
@import '../../assets/scss/vars';

.bs-single-image {
    margin-top: 240px;

    .block-meta {
        width: 50%;
    }

    // full-width
    &.format-fullwidth {
        .block-meta {
            display: none;
        }
    }

    // positioning
    &.position-right,
    &.position-left {
        margin-right: $desktop-padding;
        margin-left: $desktop-padding;
        display: flex;
    }
    &.position-right {
        .image {
            margin-left: auto;
            order: 2;
        }
    }
    &.position-center {
        .image {
            margin-right: auto;
            margin-left: auto;
        }
    }

    // formatting
    &.format-tite-landscape,
    &.format-tite-vertical {
        .image {
            width: 50%;
        }
    }
    &.format-wide-landscape,
    &.format-wide-vertical {
        .image {
            width: 75%;
        }
        .block-meta {
            display: none;
        }
    }
}

// mobile breakpoints
@media #{ $lt-phone } {
    .bs-single-image {
        &.position-right,
        &.position-left {
            margin-right: $mobile-padding;
            margin-left: $mobile-padding;
        }
    }
}
</style>
