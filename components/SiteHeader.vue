<template>
    <header class="site-header" :style="styles">
        <transition name="fade" mode="out-in">
            <nuxt-link v-if="hasArrow" :to="backLink" class="go-back">
                <svg-arrow-left :color="fgColor" />
            </nuxt-link>
            <button
                v-else-if="hasSidebar"
                @click="toggleSidebar"
                class="toggle-sidebar"
            >
                <transition name="fade" mode="out-in">
                    <svg-arrowhead-left v-if="$store.state.sidebarOpen" />
                    <svg-mag-glass v-else />
                </transition>
            </button>
        </transition>
        <filter-item-list />

        <button @click="toggleMenu" class="toggle-menu">
            <svg-hamburger :color="fgColor" />
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
import _get from 'lodash/get'

export default {
    async mounted() {
        await this.$nextTick()

        // require and init headroom
        const Headroom = require('headroom.js')
        const headroom = new Headroom(this.$el)
        headroom.init()
    },
    computed: {
        styles() {
            if (!this.bgColor) return {}
            return {
                'background-color': this.bgColor
            }
        },
        hasArrow() {
            return ['artist-slug', 'stories-slug'].includes(this.$route.name)
        },
        hasGridToggle() {
            return this.$route.name == 'index'
        },
        hasSidebar() {
            return this.$route.name == 'index'
        },
        colorTheme() {
            if (this.isFeatureStory) {
                const pageData = _get(
                    this.$store.state,
                    `pageData[features/${this.$route.params.slug}]`
                )
                const fgColor = _get(pageData, 'data.colors[0].textColor')
                const bgColor = _get(pageData, 'data.colors[0].backgroundColor')
                const aboveFold =
                    this.$store.state.browser.sTop <
                    this.$store.state.browser.winHeight + 25
                const hideBg =
                    _get(pageData, 'data.cover[0].style') == 'fullbleed' &&
                    aboveFold
                if (fgColor || bgColor) {
                    return {
                        hideBg,
                        fgColor,
                        bgColor
                    }
                }
            }
            return false
        },
        isFeatureStory() {
            return this.$route.name == 'stories-slug'
        },
        backLink() {
            if (this.isFeatureStory) {
                return { path: '../', append: true }
            } else if (!this.$store.state.browser.referredFrom) {
                return '/'
            }
            return this.$store.state.browser.referredFrom.fullPath
        },
        fgColor() {
            const theme = this.colorTheme
            return (theme && theme.fgColor) || '#000'
        },
        bgColor() {
            if (_get(this.colorTheme, 'hideBg')) return false
            return _get(this.colorTheme, 'bgColor')
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
        }
    }
}
</script>

<style lang="scss">
@import '../assets/scss/vars';

.site-header {
    transition: left 400ms $easeInOutQuad, transform 350ms $easeInOutQuad,
        background-color 200ms;
    background-color: $white;
    position: fixed;
    overflow: hidden;
    height: 90px;
    right: 0;
    left: 0;
    top: 0;

    // headroom
    &.headroom--unpinned {
        transform: translateY(-100%);
    }

    .toggle-sidebar,
    .go-back {
        position: absolute;
        padding: 35px;
        left: #{$desktop-padding - 35};
        top: 0;
    }
    .filter-item-list {
        position: absolute;
        padding: 35px;
        left: 135px;
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

// mobile breakpoints
@media #{ $lt-phone } {
    .site-header {
        width: 100%;
        height: 85px;

        // sidebar
        .sidebar-open & {
            left: 80%;
        }

        // headroom
        &.headroom--unpinned {
            transform: none;
        }

        .toggle-sidebar,
        .go-back {
            padding: 30px;
            left: #{$mobile-padding - 30};
        }
        .toggle-menu {
            padding: 30px;
            right: #{$mobile-padding - 30};
        }
        .toggle-grid {
            display: none;
        }
    }
}
</style>
