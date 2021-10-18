<template>
  <div>
    <form>
      <input v-model="email" name="email" placeholder="Email" required />
      <input v-model="password" name="password" placeholder="Password" required type="password" />
      <button color="pink" @click="submit">Sign-in</button>
    </form>
  </div>
</template>

<script lang="ts">
  import { UserActionTypes } from '@/modules/user/stores/modules/user';
  import { defineComponent } from 'vue';
  import { mapActions } from 'vuex';

  export default defineComponent({
    name: 'SignInRoute',
    data() {
      return {
        email: '',
        password: ''
      };
    },
    methods: {
      ...mapActions({
        signIn: UserActionTypes.SIGN_IN
      }),
      submit() {
        this.signIn({ email: this.email, password: this.password });
      }
    }
  });
</script>
