<template>
    <li class="menu-link">
        <button
            v-if="isSubscribe"
            @click.prevent.stop="openSubscribe"
            class="subscribe"
        >
            {{ item.name }}
        </button>
        <button
            v-else-if="isSubmit"
            @click.prevent.stop="openSubmit"
            class="subscribe"
        >
            {{ item.name }}
        </button>
        <a-div v-else :href="resolveLink(item)">{{ item.name }}</a-div>
    </li>
</template>

<script>
import _get from 'lodash/get'

export default {
    props: {
        item: {
            type: Object,
            required: true
        }
    },
    computed: {
        isSubscribe() {
            return _get(this.item, 'path') === '#subscribe'
        },
        isSubmit() {
            return _get(this.item, 'path') === '#submit'
        }
    },
    methods: {
        resolveLink(item) {
            if (item.path) return item.path
            return this.$options.filters.prismicLink(item.link)
        },
        openSubscribe() {
            this.$store.commit('OPEN_SUBSCRIBE')
        },
        openSubmit() {
            this.$store.commit('OPEN_SUBMIT')
        }
    }
}
</script>

<style lang="scss">
@import '../assets/scss/vars';

.menu-link {
}
</style>
