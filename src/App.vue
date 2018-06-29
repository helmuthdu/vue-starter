<template>
    <v-app id="app" v-if="path === '/'" dark>
        <v-navigation-drawer :mini-variant.sync="miniVariant"
                             :clipped="clipped"
                             v-model="drawer"
                             fixed
                             app>
            <v-list>
                <v-list-tile
                        router
                        :to="item.to"
                        :key="i"
                        v-for="(item, i) in items"
                        exact>
                    <v-list-tile-action>
                        <v-icon v-html="item.icon"></v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title v-text="item.title"></v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>
        <v-toolbar fixed app :clipped-left="clipped">
            <v-toolbar-side-icon @click="drawer = !drawer"></v-toolbar-side-icon>
            <v-btn icon
                   @click.stop="miniVariant = !miniVariant">
                <v-icon v-html="miniVariant ? 'chevron_right' : 'chevron_left'"></v-icon>
            </v-btn>
            <v-btn icon
                   @click.stop="clipped = !clipped">
                <v-icon>web</v-icon>
            </v-btn>
            <v-btn icon
                   @click.stop="fixed = !fixed">
                <v-icon>remove</v-icon>
            </v-btn>
            <v-toolbar-title v-text="title"></v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon
                   @click.stop="rightDrawer = !rightDrawer">
                <v-icon>menu</v-icon>
            </v-btn>
        </v-toolbar>
        <v-content>
            <v-container>
                <router-view/>
            </v-container>
        </v-content>
        <v-navigation-drawer
                temporary
                :right="right"
                v-model="rightDrawer"
                fixed>
            <v-list>
                <v-list-tile @click.native="right = !right">
                    <v-list-tile-action>
                        <v-icon light>compare_arrows</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-title>Switch drawer (click me)</v-list-tile-title>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>
        <v-footer :fixed="fixed" app>
            <span>&copy; 2017</span>
        </v-footer>
    </v-app>
    <v-app v-else>
        <v-content fill-height>
            <router-view/>
        </v-content>
    </v-app>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { Getter } from 'vuex-class';
  import { AUTH_IS_LOGGED } from '@/store/modules/auth';

  @Component
  export default class extends Vue {
    public path = '/';
    public clipped = false;
    public drawer = true;
    public fixed = true;
    public miniVariant = false;
    public right = true;
    public rightDrawer = false;
    public title = 'Vuetify.js';
    public items = [
      { icon: 'apps', title: 'Welcome', to: '/' },
      { icon: 'bubble_chart', title: 'Inspire', to: '/about' },
    ];

    @Getter(AUTH_IS_LOGGED)
    private isLogged: boolean;
  }
</script>

<style lang="stylus">
    @import '~vuetify/src/stylus/main'

    #app
        font-family 'Avenir', Helvetica, Arial, sans-serif
        -webkit-font-smoothing antialiased
        -moz-osx-font-smoothing grayscale
        text-align center
        color #2c3e50

    #nav
        padding 30px
        a
            font-weight bold
            color #2c3e50
            &.router-link-exact-active
                color #42b983
</style>
