<template>
    <aside class="site-sidebar">
        <div class="background" />
        <div class="inner-sidebar">This is the sidebar</div>
    </aside>
</template>

<script>
export default {}
</script>

<style lang="scss">
@import '../assets/scss/vars';

.site-sidebar {
    transition: transform 400ms $easeInOutQuad;
    background-color: $light-gray;
    transform: translateX(-100%);
    box-sizing: border-box;
    padding: 30px 60px;
    overflow: hidden;
    position: fixed;
    width: 320px;
    bottom: 0;
    left: 0;
    top: 0;

    .sidebar-open & {
        transform: none;
    }
}
</style>
