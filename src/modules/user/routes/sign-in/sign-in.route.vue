<template>
  <div>
    <form>
      <input v-model="email" name="email" placeholder="Email" required />
      <input v-model="password" name="password" placeholder="Password" required type="password" />
      <button @click.prevent="submit">Sign-in</button>
    </form>
  </div>
</template>

<script lang="ts">
  import { AppState } from '@/stores';
  import { defineComponent, ref } from 'vue';
  import { useStore } from 'vuex';

  export default defineComponent({
    name: 'SignInRoute',
    setup() {
      const store = useStore<AppState>();
      const email = ref('');
      const password = ref('');

      const submit = () =>
        store.dispatch('signIn', {
          email: email.value,
          password: password.value
        });

      return {
        email,
        password,
        submit
      };
    }
  });
</script>
