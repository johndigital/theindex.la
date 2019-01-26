<template>
    <div class="bs-video wiv" v-in-view>
        <video-block :embed="section.value" />
    </div>
</template>

<script>
export default {
    props: {
        section: {
            type: Object,
            required: true
        }
    }
}
</script>

<style lang="scss">
@import '../../assets/scss/vars';

.bs-video {
    padding-right: $desktop-padding;
    padding-left: $desktop-padding;
    max-width: 960px;
    margin: auto;
}

// mobile breakpoints
@media #{ $lt-phone } {
    .bs-video {
        padding-right: $mobile-padding;
        padding-left: $mobile-padding;
    }
}
</style>
