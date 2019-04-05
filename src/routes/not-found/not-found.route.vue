<template>
  <v-layout>
    <v-flex text-xs-center>
      <blockquote class="blockquote">
        You are here!
        <footer>
          <small> <em>&mdash;But nothing found for you #404</em> </small>
        </footer>
      </blockquote>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class AboutRoute extends Vue {}
</script>
