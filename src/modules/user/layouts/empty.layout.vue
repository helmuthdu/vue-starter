<template>
  <router-view />
</template>

<script lang="ts">
import { UserActionTypes } from '../stores/modules/user';
import { Options, Vue } from 'vue-class-component';
import { Getter } from 'vuex-class';

@Options({})
export default class EmptyLayout extends Vue {
  public path = '/';
  @Getter(UserActionTypes.IS_LOGGED_IN)
  private isLogged: boolean;
}
</script>

<style lang="scss"></style>
