import AboutPage from '@/pages/about.page.vue';
import HomePage from '@/pages/home.page.vue';
import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export const MAIN_ROUTES = Object.freeze({
  HOME: 'home-route',
  ABOUT: 'about-route'
});

const createRouter = (routes: any[]) => new Router({
  mode: 'history',
  routes: [
    ...routes.reduce((a, b) => a.concat(b), []),
    {
      path: '/',
      component: () => import('@/layout/default.layout.vue'),
      children: [
        { path: '/about', name: MAIN_ROUTES.ABOUT, component: AboutPage },
        { path: '', name: MAIN_ROUTES.HOME, component: HomePage }
      ]
    }
  ]
});

export default createRouter;
