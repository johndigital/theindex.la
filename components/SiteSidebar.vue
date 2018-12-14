<template>
    <sidebar class="site-sidebar"> This is the sidebar </sidebar>
</template>

<script>
export default {}
</script>

<style lang="scss">
@import '../assets/scss/vars';

.site-sidebar {
    background-color: $light-gray;
    box-sizing: border-box;
    padding: 30px 60px;
    position: fixed;
    width: 320px;
    bottom: 0;
    left: 0;
    top: 0;
}
</style>
