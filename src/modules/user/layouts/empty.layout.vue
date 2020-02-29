<template>
  <v-app>
    <v-content fill-height>
      <router-view />
    </v-content>
  </v-app>
</template>

<script lang="ts">
import { UserActionTypes } from '../stores/modules/user';
import { Component, Vue } from 'vue-property-decorator';
import { Getter } from 'vuex-class';

@Component
export default class EmptyLayout extends Vue {
  public path = '/';
  @Getter(UserActionTypes.IS_LOGGED_IN)
  private isLogged: boolean;
}
</script>

<style lang="scss"></style>
