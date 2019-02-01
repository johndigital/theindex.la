<template>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        width="24px"
        height="20px"
        x="0px"
        y="0px"
        viewBox="0 0 24 20"
        xml:space="preserve"
        class="svg-hamburger"
    >
        <line
            fill="none"
            stroke="#000"
            stroke-width="2"
            x1="0"
            y1="2"
            x2="24"
            y2="2"
        ></line>
        <line
            fill="none"
            stroke="#000"
            stroke-width="2"
            x1="0"
            y1="10"
            x2="24"
            y2="10"
        ></line>
        <line
            fill="none"
            stroke="#000"
            stroke-width="2"
            x1="0"
            y1="18"
            x2="24"
            y2="18"
        ></line>
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
