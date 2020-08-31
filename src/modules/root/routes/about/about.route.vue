<template>
  <blockquote class="blockquote">
    &#8220;I'm about to...&#8221;
    <footer>
      <small> <em>&mdash;Some dude on internet</em> </small>
    </footer>
  </blockquote>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({})
export default class AboutRoute extends Vue {}
</script>
