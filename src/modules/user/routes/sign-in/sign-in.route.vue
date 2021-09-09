<template>
  <div>
    <form>
      <input v-model="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
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
