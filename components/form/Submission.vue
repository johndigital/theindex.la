<template>
    <form
        @submit.prevent="onSubmit"
        :class="['form-submission', { 'value-valid': valueValid }]"
    >
        <input
            type="text"
            placeholder="enter artist name or website"
            v-model="value"
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
            alert('submission submitted.')
        }
    }
}
</script>

<style lang="scss">
@import '../../assets/scss/vars';
</style>
