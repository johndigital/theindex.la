<template>
    <aside class="site-sidebar">
        <div class="inner-sidebar">
            <search-field />
            <search-control-sort />
            <!-- <search-control-filter title="Type" dimension="type" />
            <search-control-filter title="Category" dimension="category" />
            <search-control-filter title="Location" dimension="region" /> -->
        </div>
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
    overflow: hidden;
    position: fixed;
    width: 320px;
    bottom: 0;
    left: 0;
    top: 0;

    .inner-sidebar {
        padding: 30px 60px;
    }
    .filter-select {
        margin-top: 20px;
    }

    .search-control-sort {
        margin-top: 90px;
    }

    .sidebar-open & {
        transform: none;
    }
}
</style>
