<template>
  <div>
    <h1>You are here!</h1>
    <h2>But nothing found for you #404</h2>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class NotFoundRoute extends Vue {}
</script>
