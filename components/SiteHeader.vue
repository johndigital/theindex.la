<template>
    <header class="site-header">
        <nuxt-link v-if="hasArrow" :to="backLink" class="toggle-sidebar">
            <svg-arrow-left />
        </nuxt-link>
        <button v-else @click="toggleSidebar" class="toggle-sidebar">
            <transition name="fade" mode="out-in">
                <svg-arrowhead-left v-if="$store.state.sidebarOpen" />
                <svg-mag-glass v-else />
            </transition>
        </button>

        <button @click="toggleMenu" class="toggle-menu">
            <svg-hamburger />
        </button>
        <button v-if="hasGridToggle" @click="toggleGrid" class="toggle-grid">
            <transition name="fade" mode="out-in">
                <span
                    v-if="$store.state.gridView"
                    class="icon-rounded-square"
                />
                <svg-dot-grid v-else />
            </transition>
        </button>
    </header>
</template>

<script>
export default {
    computed: {
        hasArrow() {
            return ['artist-slug', 'features-slug'].includes(this.$route.name)
        },
        hasGridToggle() {
            this.$route.name == 'index'
        },
        backLink() {
            if (!this.$store.state.browser.referredFrom) return '/'
            return this.$store.state.browser.referredFrom.fullPath
        }
    },
    methods: {
        toggleSidebar() {
            if (this.$store.state.sidebarOpen)
                this.$store.commit('CLOSE_SIDEBAR')
            else this.$store.commit('OPEN_SIDEBAR')
        },
        toggleMenu() {
            if (this.$store.state.menuOpen) this.$store.commit('CLOSE_MENU')
            else this.$store.commit('OPEN_MENU')
        },
        toggleGrid() {
            if (this.$store.state.gridView) this.$store.commit('LIST_VIEW')
            else this.$store.commit('GRID_VIEW')
        },
        onArrowClick() {
            alert('clicked arrow')
        }
    }
}
</script>

<style lang="scss">
@import '../assets/scss/vars';

.site-header {
    transition: left 400ms $easeInOutQuad;
    background-color: $white;
    position: fixed;
    overflow: hidden;
    height: 90px;
    right: 0;
    left: 0;
    top: 0;

    .toggle-sidebar {
        position: absolute;
        padding: 35px;
        left: #{$desktop-padding - 35};
        top: 0;
    }
    .toggle-menu {
        position: absolute;
        padding: 35px;
        right: #{$desktop-padding - 35};
        top: 0;
    }
    .toggle-grid {
        position: absolute;
        padding: 35px;
        padding-right: 20px;
        right: #{$desktop-padding + 45};
        top: 0;
    }
    .icon-rounded-square {
        background-color: $black;
        display: inline-block;
        border-radius: 2px;
        height: 18px;
        width: 18px;
    }
    .sidebar-open & {
        left: 320px;
    }
    .svg-arrow-left polyline {
        transition: stroke 250ms $easeInOutQuad;
        stroke: $dark-gray;
    }
    .toggle-sidebar:hover polyline {
        stroke: $black;
    }
}
</style>
