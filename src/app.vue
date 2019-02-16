<template>
  <router-view />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class extends Vue {}
</script>

<style lang="scss">
@import '~@mdi/font/css/materialdesignicons.css';
@import '~buefy/dist/buefy.css';
</style>
