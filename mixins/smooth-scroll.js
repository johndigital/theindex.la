import { listen, schedule, everyFrame, transform } from 'popmotion'
const { smooth } = transform

export default smoothing => {
    return {
        data() {
            return {
                scheduler: null,
                ssTop: 0
            }
        },
        mounted() {
            this.ssTop = this.$store.state.browser.sTop
            this.scheduler = schedule(everyFrame(), listen(window, 'scroll'))
                .pipe(
                    e => {
                        return this.$store.state.browser.sTop
                    },
                    smooth(smoothing)
                )
                .start(sTop => (this.ssTop = Math.round(sTop)))
        },
        beforeDestroy() {
            if (this.scheduler) this.scheduler.stop()
        }
    }
}
