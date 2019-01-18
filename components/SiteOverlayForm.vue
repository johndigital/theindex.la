<template>
    <transition name="overlay-fade">
        <section
            v-show="isOpen"
            @click="closeOverlay"
            @keydown.esc="closeOverlay"
            class="site-overlay-form"
        >
            <form-submission
                v-if="$store.state.submitOpen"
                @click.native.stop
            />
            <form-subscribe
                v-else-if="$store.state.subscribeOpen"
                @click.native.stop
            />
        </section>
    </transition>
</template>

<script>
export default {
    computed: {
        isOpen() {
            const { subscribeOpen, submitOpen } = this.$store.state
            return subscribeOpen || submitOpen
        }
    },
    methods: {
        closeOverlay() {
            this.$store.commit('CLOSE_SUBSCRIBE')
            this.$store.commit('CLOSE_SUBMIT')
        }
    }
}
</script>

<style lang="scss">
@import '../assets/scss/vars';

.site-overlay-form {
    background-color: $black;
    color: $white;
    position: fixed;
    display: flex;
    bottom: 0;
    right: 0;
    left: 0;
    top: 0;

    .message {
        margin: auto;
    }
    form {
        padding-top: 90px;
        text-align: center;
        max-width: 560px;
        margin: auto;
        width: 100%;
    }
    input {
        border-bottom: 1px solid $white;
        padding-bottom: 10px;
        text-align: center;
        font-size: 28px;
        color: $white;
        width: 100%;
    }
    .submit {
        transition: background-color 400ms, color 400ms, opacity 400ms;
        border-radius: 3px;
        padding: 15px 20px;
        margin-top: 45px;
        font-size: 18px;
        color: $white;

        &:hover {
            background-color: $white;
            color: $black;
        }
    }
    form .submit {
        opacity: 0;
    }
    .value-valid .submit {
        opacity: 1;
    }
}

.overlay-fade-enter-active,
.overlay-fade-leave-active {
    transition: opacity 450ms ease;

    form {
        transition: transform 350ms ease;
        transition-delay: 75ms;
    }
}
.overlay-fade-enter,
.overlay-fade-leave-to {
    opacity: 0;
}
.overlay-fade-enter form {
    transform: translateY(35px);
}
</style>
