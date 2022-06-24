<template>
  <div>
    <form>
      <input v-model="email" name="email" placeholder="Email" required />
      <input v-model="password" name="password" placeholder="Password" required type="password" />
      <button @click.prevent="submit">Sign-in</button>
    </form>
    <template v-if="isLoggedIn"> User: {{ user.email }} </template>
  </div>
</template>

<script lang="ts">
import { useStore } from '@/stores';
import { computed, defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'SignInRoute',
  setup() {
    const store = useStore();
    const email = ref('');
    const password = ref('');
    const isLoggedIn = computed(() => store.user.isLoggedIn);
    const user = computed(() => store.user.entity);

    const submit = () =>
      store.user.signIn({
        email: email.value,
        password: password.value
      });

    return {
      email,
      password,
      submit,
      isLoggedIn,
      user
    };
  }
});
</script>
