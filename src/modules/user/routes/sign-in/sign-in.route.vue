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
import { UserActionTypes } from '../../stores/modules/user';
import { Options, Vue } from 'vue-class-component';
import { Action } from 'vuex-class';

@Options({})
export default class SignInRoute extends Vue {
  public email = '';
  public password = '';

  @Action(UserActionTypes.SIGN_IN)
  private doLogin: any;

  public submit() {
    this.doLogin({ email: this.email, password: this.password });
  }
}
</script>

<style lang="scss" scoped></style>
