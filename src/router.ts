import Vue from 'vue';
import Router from 'vue-router';

import About from '@/routes/about/about.route.vue';
import Home from '@/routes/home/home.route.vue';

Vue.use(Router);

export const MAIN_ROUTES = Object.freeze({
  HOME: 'home-route',
  ABOUT: 'about-route',
});

const createRouter = (routes: any[]) =>
  new Router({
    mode: 'history',
    routes: [
      ...routes.reduce((a, b) => a.concat(b), []),
      {
        path: '/',
        component: () => import('@/layouts/default.layout.vue'),
        children: [
          { path: '/about', name: MAIN_ROUTES.ABOUT, component: About },
          { path: '', name: MAIN_ROUTES.HOME, component: Home },
        ],
      },
    ],
  });

export default createRouter;
