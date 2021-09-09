<template>
  <h1>Oops!</h1>
  <h3>The {{ resource }} you're looking for is not here.</h3>
  <a href="#" @click="$router.go(-1)">click here</a> to go back.
</template>
<script>
  export default {
    props: {
      resource: {
        type: String,
        required: true,
        default: 'page'
      }
    }
  };
</script>
