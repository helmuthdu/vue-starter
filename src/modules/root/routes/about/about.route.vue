<template>
  <div>
    <blockquote class="blockquote">
      &#8220;First, solve the problem. Then, write the code.&#8221;
      <footer>
        <small> <em>&mdash;John Johnson</em> </small>
      </footer>
    </blockquote>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class AboutRoute extends Vue {}
</script>
