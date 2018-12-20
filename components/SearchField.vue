<template>
    <div class="search-field">
        <input v-model="q" type="text" placeholder="Search" />
    </div>
</template>

<script>
import _throttle from 'lodash/throttle'
import _omit from 'lodash/omit'

export default {
    data() {
        return {
            q: ''
        }
    },
    watch: {
        q: 'setQueryVal'
    },
    mounted() {
        if (this.$route.query.q) {
            this.q = decodeURIComponent(this.$route.query.q)
        }
    },
    methods: {
        setQueryVal: _throttle(function() {
            if (this.$route.query.q !== this.q)
                if (this.q) {
                    this.$router.push({
                        ...this.$route,
                        query: {
                            ...this.$route.query,
                            q: encodeURIComponent(this.q)
                        }
                    })
                } else {
                    this.$router.push({
                        ...this.$route,
                        query: _omit(this.$route.query, ['q'])
                    })
                }
        }, 250)
    }
}
</script>

<style lang="scss">
@import '../assets/scss/vars';

.search-field {
}
</style>
