<template>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        viewBox="0 0 27 20"
        xml:space="preserve"
        width="27px"
        height="20px"
    >
        <line
            fill="none"
            :stroke="color"
            stroke-width="2"
            x1="1.74"
            y1="9.76"
            x2="26.68"
            y2="9.76"
        />
        <polyline
            fill="none"
            :stroke="color"
            stroke-width="2"
            points="11.05,19.08 1.74,9.76 10.57,0.92 "
        />
    </svg>
</template>

<script>
export default {
    props: {
        color: {
            type: String,
            default: '#000000'
        }
    }
}
</script>
