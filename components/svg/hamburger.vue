<template>
    <svg
        class="svg-hamburger"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        width="24px"
        height="18px"
        x="0px"
        y="0px"
        viewBox="0 0 24 18"
        xml:space="preserve"
    >
        <line
            fill="none"
            :stroke="color"
            stroke-width="2"
            x1="0"
            y1="1"
            x2="24"
            y2="1"
        />
        <line
            fill="none"
            :stroke="color"
            stroke-width="2"
            x1="0"
            y1="9"
            x2="24"
            y2="9"
        />
        <line
            fill="none"
            :stroke="color"
            stroke-width="2"
            x1="0"
            y1="17"
            x2="24"
            y2="17"
        />
    </svg>
</template>

<script>
export default {
    props: {
        color: {
            type: String,
            default: '#000'
        }
    }
}
</script>
