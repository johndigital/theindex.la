<template>
    <a v-if="isExternal" :target="target" :href="link | prismicLink">
        <slot />
    </a>
    <router-link
        v-else
        :to="link | prismicLink"
    >
        <slot />
    </router-link>
</template>

<script>
import _get from 'lodash/get'

export default {
    props: {
        link: {
            type: Object,
            required: true
        }
    },
    computed: {
        isExternal() {
            return _get(this.link, 'link_type') == 'Web'
        },
        target() {
            return _get(this.link, 'target', '_self')
        }
    }
}
</script>
