<template>
    <main class="stories">
        <div class="inner">
            <story-row
                v-for="(story, i) in stories"
                :key="i"
                :story="story"
                :pinned="i == 0"
            />
        </div>
    </main>
</template>

<script>
import { fetchByType } from '~/libs/prismic'
import _get from 'lodash/get'

export default {
    async fetch({ store, params, query }) {
        const stories = await fetchByType({
            type: 'feature',
            pageSize: 20,
            orderings: '[my.feature.timestamp desc]'
        })

        if (stories) {
            store.commit('SET_PAGE_DATA', {
                key: `stories`,
                data: stories
            })
        }
    },
    computed: {
        stories() {
            return _get(this.$store.state, 'pageData.stories', [])
        }
    }
}
</script>

<style lang="scss">
@import '../../assets/scss/vars';

.stories {
    .inner {
        padding: $header-height $desktop-padding 50px;
    }
    .story-row {
        margin-bottom: 120px;
    }
}
</style>
