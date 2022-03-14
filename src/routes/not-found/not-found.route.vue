<template>
  <section>
    <h1>Oops!</h1>
    <h3>The {{ resource }} you're looking for is not here.</h3>
    <a href="#" @click="$router.go(-1)">click here</a> to go back.
  </section>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'NotFound',
  props: {
    resource: {
      type: String,
      required: true,
      default: 'page'
    }
  }
});
</script>
