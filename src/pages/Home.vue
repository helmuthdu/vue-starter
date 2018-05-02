<template>
    <div class="ui center aligned container">
        <img class="ui centered image" src="../assets/logo.png">
        <HelloWorld msg="Welcome to Your Vue.js App"/>
    </div>
</template>

<script lang="ts">
  import HelloWorld from '@/components/HelloWorld/HelloWorld.vue'; // @ is an alias to /src
  import { Component, Vue } from 'vue-property-decorator';

  @Component({
    components: {
      HelloWorld,
    },
  })
  export default class Home extends Vue {
  }
</script>
