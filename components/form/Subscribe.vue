<template>
    <transition name="fade" mode="out-in">
        <div class="message success" v-if="success" key="s">
            <h2>Thank you.</h2>
        </div>
        <div class="message error" v-else-if="error" key="e">
            <h2>Something went wrong, please try again.</h2>
        </div>
        <form
            :class="['form-subscribe']"
            @submit.prevent="onSubmit"
            action="/api/subscribe"
            method="POST"
            key="form"
            v-else
        >
            <input
                class="email"
                type="email"
                placeholder="enter email for updates"
                v-model="value"
                required
            />
            <input class="water" type="text" name="water" v-model="honeypot" />
            <button class="submit" type="submit">Submit</button>
        </form>
    </transition>
</template>

<script>
export default {
    data() {
        return {
            success: false,
            error: false,
            honeypot: '',
            value: ''
        }
    },
    computed: {
        valueValid() {
            return this.value
        }
    },
    methods: {
        async onSubmit() {
            try {
                const response = await fetch('/api/subscribe', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: this.value,
                        water: this.honeypot
                    })
                }).then(r => r.json())

                // check success
                if (response && response.success) {
                    this.success = true

                    setTimeout(() => {
                        this.$store.commit('CLOSE_MENU')
                        this.$store.commit('CLOSE_SUBSCRIBE')
                    }, 3500)
                } else {
                    throw new Error('Failed response.')
                }
            } catch (err) {
                this.error = true
            }
        }
    }
}
</script>

<style lang="scss">
@import '../../assets/scss/vars';

.form-subscribe {
    .email:valid + .submit {
        opacity: 1;
    }
    .water {
        position: absolute;
        visibility: hidden;
        left: -10000px;
        opacity: 0;
    }
}
</style>
