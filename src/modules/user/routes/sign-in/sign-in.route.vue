<template>
  <div>
    <form>
      <input v-model="email" name="email" placeholder="Email" required />
      <input v-model="password" name="password" placeholder="Password" required type="password" />
      <button @click.prevent="submit">Sign-in</button>
    </form>
    <template v-if="isLoggedIn"> User: {{ user.data.email }}</template>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/modules/user/stores/user.store.ts';
import { ref } from 'vue';

defineOptions({
  name: 'SignInRoute',
});

const {
  state: user,
  actions: { signIn },
  getters: { isLoggedIn },
} = useUserStore();

const email = ref('');
const password = ref('');

const submit = () =>
  signIn({
    email: email.value,
    password: password.value,
  });
</script>
