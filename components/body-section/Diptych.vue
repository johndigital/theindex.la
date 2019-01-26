<template>
    <div class="bs-diptych wiv" v-in-view>
        <div class="diptych-left">
            <no-ssr>
                <responsive-image
                    v-if="hasLeftImg"
                    :object="leftImage | prisToRezImg"
                />
            </no-ssr>
        </div>
        <div class="diptych-right">
            <no-ssr>
                <responsive-image
                    v-if="hasRightImg"
                    :object="rightImage | prisToRezImg"
                />
            </no-ssr>
        </div>
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
        hasLeftImg() {
            return this.leftImage && this.leftImage.url
        },
        hasRightImg() {
            return this.rightImage && this.rightImage.url
        },
        leftImage() {
            return _get(this.section, 'value[0].left-image')
        },
        rightImage() {
            return _get(this.section, 'value[0].right-image')
        }
    }
}
</script>

<style lang="scss">
@import '../../assets/scss/vars';

.bs-diptych {
    align-items: center;
    margin-top: 240px;
    display: flex;

    .diptych-left,
    .diptych-right {
        width: 50%;
    }
    .responsive-image {
        width: 72%;
    }
    .diptych-left {
        padding-right: 50px;

        .responsive-image {
            margin-left: auto;
        }
    }
    .diptych-right {
        padding-left: 50px;

        .responsive-image {
            margin-right: auto;
        }
    }
}

// mobile breakpoints
@media #{ $lt-phone } {
    .bs-diptych {
        margin-top: 60px;
        flex-direction: column;

        .diptych-left,
        .diptych-right {
            width: 100%;
            padding: 0;
        }
        .diptych-right {
            margin-top: 30px;
        }
    }
}
</style>
