<template>
  <section>
    <hr />
    <a href="https://vuejs.org/" target="_blank">vue Documentation</a> <br />
    <a href="https://github.com/vue/vue.js" target="_blank">vue GitHub</a>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class HomeRoute extends Vue {}
</script>
