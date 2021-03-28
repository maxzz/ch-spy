<template>
    <!-- https://icones.js.org/collection/tabler -->
    <svg
        v-if="locked"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
    >
        <g
            class="icon-tabler"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        >
            <rect x="5" y="11" width="14" height="10" rx="2"></rect>
            <circle cx="12" cy="16" r="1"></circle>
            <path d="M8 11V7a4 4 0 0 1 8 0v4"></path>
        </g>
    </svg>
    <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
    >
        <g
            class="icon-tabler"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        >
            <rect x="5" y="11" width="14" height="10" rx="2"></rect>
            <circle cx="12" cy="16" r="1"></circle>
            <path d="M8 11V6a4 4 0 0 1 8 0"></path>
        </g>
    </svg>
    <!-- <svg
        v-if="locked"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
    >
        <path
            d="M12 17a2 2 0 0 1-2-2c0-1.11.89-2 2-2a2 2 0 0 1 2 2a2 2 0 0 1-2 2m6 3V10H6v10h12m0-12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10c0-1.11.89-2 2-2h1V6a5 5 0 0 1 5-5a5 5 0 0 1 5 5v2h1m-6-5a3 3 0 0 0-3 3v2h6V6a3 3 0 0 0-3-3z"
        ></path>
    </svg>
    <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
    >
        <path
            d="M10 13a2 2 0 0 1 2 2c0 1.11-.89 2-2 2s-2-.89-2-2s.9-2 2-2m8-12c-2.76 0-5 2.24-5 5v2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2h-1V6c0-1.66 1.34-3 3-3s3 1.34 3 3v2h2V6c0-2.76-2.24-5-5-5m-2 9v10H4V10h12z"
        ></path>
    </svg> -->

    <!-- <svg
        v-if="locked"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
    >
        <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
        />
    </svg>
    <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
    >
        <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
        />
    </svg> -->
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    props: {
        locked: {
            type: Boolean,
        },
    },
    // setup() {
    //     return {};
    // }
});
</script>
