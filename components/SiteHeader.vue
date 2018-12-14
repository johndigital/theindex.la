<template>
    <header @click="toggle" class="site-header"><svg-mag-glass /></header>
</template>

<script>
export default {
    methods: {
        toggle() {
            if (this.$store.state.sidebarOpen)
                this.$store.commit('CLOSE_SIDEBAR')
            else this.$store.commit('OPEN_SIDEBAR')
        }
    }
}
</script>

<style lang="scss">
@import '../assets/scss/vars';

.site-header {
    transition: left 400ms $easeInOutQuad;
    background-color: $white;
    padding: 35px $desktop-padding;
    position: fixed;
    right: 0;
    left: 0;
    top: 0;

    .sidebar-open & {
        left: 320px;
    }
}
</style>
