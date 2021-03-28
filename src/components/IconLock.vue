<template>
    <!-- https://icones.js.org/collection/tabler -->
    <svg v-if="locked" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <g fill="none" stroke="currentColor">
            <rect x="5" y="11" width="14" height="10" rx="2"></rect>
            <circle cx="12" cy="16" r="1"></circle>
            <path d="M8 11V7a4 4 0 0 1 8 0v4"></path>
        </g>
    </svg>
    <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <g fill="none" stroke="currentColor">
            <rect x="5" y="11" width="14" height="10" rx="2"></rect>
            <circle cx="12" cy="16" r="1"></circle>
            <path d="M8 11V6a4 4 0 0 1 8 0"></path>
        </g>
    </svg>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';

    export default defineComponent({
        props: {
            locked: {
                type: Boolean,
            },
        }
    });
</script>
