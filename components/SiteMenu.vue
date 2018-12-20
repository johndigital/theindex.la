<template>
    <transition name="menu-fade">
        <section
            v-show="$store.state.menuOpen"
            @click="closeMenu"
            class="site-menu"
        >
            <nuxt-link class="logo" to="/"> <svg-logo /> </nuxt-link>
            <div class="menus">
                <nav class="main-menu menu">
                    <ul>
                        <menu-link
                            v-for="(item, i) in mainItems"
                            :item="item"
                            :key="i"
                        />
                    </ul>
                </nav>
                <nav class="social-menu menu">
                    <ul>
                        <menu-link
                            v-for="(item, i) in socialItems"
                            :item="item"
                            :key="i"
                        />
                    </ul>
                </nav>
            </div>
        </section>
    </transition>
</template>

<script>
import _get from 'lodash/get'

export default {
    computed: {
        siteMeta() {
            return _get(this.$store.state, 'pageData.meta')
        },
        mainItems() {
            return _get(this.siteMeta, 'data.main_menu', [])
        },
        socialItems() {
            return _get(this.siteMeta, 'data.social_menu', [])
        }
    },
    methods: {
        closeMenu() {
            this.$store.commit('CLOSE_MENU')
        }
    }
}
</script>

<style lang="scss">
@import '../assets/scss/vars';

.site-menu {
    position: fixed;
    background-color: $black;
    justify-content: space-between;
    align-items: center;
    display: flex;
    bottom: 0;
    right: 0;
    left: 0;
    top: 0;

    a,
    button {
        text-decoration: none;
        color: $dark-gray;
    }
    button {
        transition: color 250ms $easeInOutQuad;
        padding: 0;
    }

    // logo (left half)
    .logo {
        margin-left: $desktop-padding;
        font-size: 0;
    }
    .logo svg {
        width: 120px;
        height: 35px;

        path,
        rect,
        polygon {
            fill: $white;
        }
    }

    // menus (right half)
    .menus {
        margin-right: $desktop-padding;
        text-align: right;
    }
    .menu .nuxt-link-active,
    .menu li *:hover {
        color: $white;
    }
    .main-menu,
    .main-menu button {
        font-size: 28px;
    }
    .social-menu li {
        line-height: 2;
    }
}
</style>
