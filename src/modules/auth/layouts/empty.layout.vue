<template>
  <div>
    <router-view />
  </div>
</template>

<script lang="ts">
import { AuthActions } from '@/modules/auth/store';
import { Component, Vue } from 'vue-property-decorator';
import { Getter } from 'vuex-class';

@Component
export default class extends Vue {
  public path = '/';
  @Getter(AuthActions.IS_LOGGED)
  private isLogged: boolean;
}
</script>

<style lang="scss"></style>
