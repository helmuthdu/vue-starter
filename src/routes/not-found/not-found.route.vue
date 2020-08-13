<template>
  <div>
    <h1>You are here!</h1>
    <h2>But nothing found for you #404</h2>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({})
export default class NotFoundRoute extends Vue {}
</script>
