<template>
  <v-app>
    <v-content fill-height> <router-view /> </v-content>
  </v-app>
</template>

<script lang="ts">
import { AUTHENTICATION_IS_LOGGED } from '@/modules/auth/store';
import { Component, Vue } from 'vue-property-decorator';
import { Getter } from 'vuex-class';

@Component
export default class extends Vue {
  public path = '/';
  @Getter(AUTHENTICATION_IS_LOGGED)
  private isLogged: boolean;
}
</script>

<style lang="stylus">
@import '~vuetify/src/stylus/main'
</style>
