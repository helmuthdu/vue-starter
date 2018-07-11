<template>
<router-view/>
</template>

<script lang="ts">
import { AUTHENTICATION_IS_LOGGED } from '@/modules/auth/store';
import { Component, Vue } from 'vue-property-decorator';
import { Getter } from 'vuex-class';

@Component
export default class extends Vue {
  @Getter(AUTHENTICATION_IS_LOGGED)
  private isLogged: boolean;
}
</script>

<style lang="stylus">
</style>
