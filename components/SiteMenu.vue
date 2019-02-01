<template>
    <transition name="menu-fade" :duration="550">
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
    mounted() {
        this.resolveHashAction()
    },
    watch: {
        '$route.hash': 'resolveHashAction'
    },
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
        },
        resolveHashAction() {
            if (this.$route.hash === '#submit') {
                this.$store.commit('OPEN_SUBMIT')
            }
            if (this.$route.hash === '#subscribe') {
                this.$store.commit('OPEN_SUBSCRIBE')
            }
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
        margin-left: 9%;
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
        margin-right: 9%;
        text-align: right;
    }
    .menu .nuxt-link-exact-active,
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

// Transition
.menu-fade-enter-active,
.menu-fade-leave-active {
    transition: opacity 450ms $authenticMotion;
    pointer-events: none;

    .logo,
    .menus {
        transition: opacity 500ms, transform 400ms;
    }
    .menu li {
        transition: opacity 250ms;
    }
}

// stagger only on open
.menu-fade-enter-active {
    .logo,
    .menus {
        transition-delay: 100ms;
    }
    @for $i from 1 through 6 {
        .menu li:nth-child(6n + #{ $i }) {
            transition-delay: #{50 * $i}ms;
        }
    }
}

// off state
.menu-fade-enter,
.menu-fade-leave-to {
    opacity: 0;

    .menu li,
    .logo {
        opacity: 0;
    }
}

// only slide up on enter
.menu-fade-enter {
    .logo,
    .menus {
        transform: translateY(30px);
    }
}

// mobile breakpoints
@media #{ $lt-phone } {
    .site-menu {
        justify-content: flex-end;

        .main-menu,
        .main-menu button {
            font-size: 25px;
        }

        .logo {
            display: none;
        }
        .menus {
            margin-right: $mobile-padding;
        }
    }
}
</style>
