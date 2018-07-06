<template>
<v-layout fill-height justify-center align-center>
  <v-flex xs12 sm5 md4 lg3>
    <v-card>
      <v-card-title primary-title>
        <v-layout column>
          <v-flex>
            <h2 class="headline">LOGIN</h2>
          </v-flex>
          <v-flex>
            <v-form>
              <v-text-field
                label="Email"
                v-model="email"
                required/>
              <v-text-field
                type="password"
                label="Password"
                v-model="password"
                required/>
            </v-form>
          </v-flex>
        </v-layout>
      </v-card-title>
      <v-card-actions>
        <v-container>
          <v-layout column align-center>
            <v-flex>
              <v-btn color="pink" dark @click="submit">Sign-in</v-btn>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-actions>
    </v-card>
  </v-flex>
</v-layout>
</template>

<script lang="ts">
import { AUTHENTICATION_LOGIN } from '@/modules/authentication/store';
import { Component, Vue } from 'vue-property-decorator';
import { Action } from 'vuex-class';

@Component
export default class extends Vue {
  public email = '';
  public password = '';

  @Action(AUTHENTICATION_LOGIN)
  private doLogin: any;

  public submit() {
    this.doLogin({ email: this.email, password: this.password });
  }
}
</script>

<style lang="stylus" scoped>
.headline
  color: #e91e63;
  border-left: 1rem solid #e91e63;
  padding-left: 1rem;
  margin-left: -1.125rem;
</style>
