<template>
    <form @submit.prevent="onSubmit" :class="['form-subscribe']">
        <input
            class="email"
            type="email"
            placeholder="enter email address"
            v-model="value"
            required
        />
        <button class="submit" type="submit">Submit</button>
    </form>
</template>

<script>
export default {
    data() {
        return {
            value: ''
        }
    },
    computed: {
        valueValid() {
            return this.value
        }
    },
    methods: {
        onSubmit() {
            alert('subscription submitted.')
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
}
</style>
