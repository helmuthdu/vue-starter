<template>
  <div>
    <form>
      <input label="Email" v-model="email" required />
      <input type="password" label="Password" v-model="password" required />
      <button color="pink" dark @click="submit">Sign-in</button>
    </form>
  </div>
</template>

<script lang="ts">
import { AuthActions } from '../../stores/modules/auth';
import { Component, Vue } from 'vue-property-decorator';
import { Action } from 'vuex-class';

@Component
export default class SignInRoute extends Vue {
  public email = '';
  public password = '';

  @Action(AuthActions.LOGIN)
  private doLogin: any;

  public submit() {
    this.doLogin({ email: this.email, password: this.password });
  }
}
</script>

<style lang="scss" scoped></style>
