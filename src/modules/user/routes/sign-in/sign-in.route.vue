<template>
  <div>
    <form>
      <input v-model="email" name="email" placeholder="Email" required />
      <input v-model="password" name="password" placeholder="Password" required type="password" />
      <button @click.prevent="submit">Sign-in</button>
    </form>
    User: {{ user.entity.email }}
  </div>
</template>

<script lang="ts">
  import { useStore } from '@/stores';
  import { defineComponent, ref } from 'vue';

  export default defineComponent({
    name: 'SignInRoute',
    setup() {
      const store = useStore();
      const email = ref('');
      const password = ref('');

      const submit = () =>
        store.user.signIn({
          email: email.value,
          password: password.value
        });

      return {
        email,
        password,
        submit,
        user: store.user.state
      };
    }
  });
</script>
