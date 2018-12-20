<template>
    <aside class="site-sidebar">
        <div class="inner-sidebar">
            <search-field />
            <search-control-sort />
            <search-control-filter title="Type" dimension="type" />
            <search-control-filter title="Category" dimension="category" />
            <search-control-filter title="Location" dimension="region" />
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
    position: fixed;
    overflow: auto;
    width: 320px;
    bottom: 0;
    left: 0;
    top: 0;

    .inner-sidebar {
        padding: 30px 60px;
    }

    .search-control-sort {
        margin-top: 90px;
    }
    .search-control-filter {
        margin-top: 60px;
    }

    .sidebar-open & {
        transform: none;
    }

    // list select styling
    .filter-select {
        list-style-type: none;
        padding: 0;
        margin: 0;
        margin-top: 20px;

        button {
            padding: 0;
        }
        a {
            text-decoration: none;
            color: $dark-gray;
        }
        a.nuxt-link-exact-active,
        a.item-active,
        a:hover {
            color: $black;
        }
        li {
            position: relative;
        }
        .nuxt-link-exact-active::before,
        .item-active::before {
            background-color: $black;
            border-radius: 100%;
            position: absolute;
            content: '';
            right: calc(100% + 10px);
            margin: auto;
            height: 6px;
            width: 6px;
            bottom: 0;
            top: 0;
        }
    }
}
</style>
