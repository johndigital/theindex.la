<template>
    <transition name="fade">
        <section
            v-if="$store.state.showLoading"
            class="loading-screen"
            aria-hidden="true"
        >
            <story-splash v-if="hasSplash" />
            <svg-logo v-else />
        </section>
    </transition>
</template>

<script>
import _get from 'lodash/get'

export default {
    computed: {
        hasSplash() {
            const splashEnabled =
                _get(
                    this.$store.state.pageData,
                    `features/${this.$route.params.slug}.data.takeover_enabled`
                ) == 'Enabled'

            return splashEnabled && this.$route.name == 'stories-slug'
        }
    }
}
</script>

<style lang="scss">
@import '../assets/scss/vars';

section.loading-screen {
    background-color: $white;
    @include fill;
    position: fixed;
    display: flex;

    .svg-logo {
        margin: auto;
        width: 150px;
        height: 40px;
    }

    &.fade-enter-active,
    &.fade-leave-active {
        transition: opacity 750ms;
    }
}
</style>
