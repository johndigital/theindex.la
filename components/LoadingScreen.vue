<template>
    <transition name="fade">
        <section
            v-if="$store.state.showLoading"
            class="loading-screen"
            aria-hidden="true"
        >
            <svg-logo />
        </section>
    </transition>
</template>

<script>
export default {}
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
