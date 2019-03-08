import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export const MAIN_ROUTES = Object.freeze({
  HOME: 'home-route',
  ABOUT: 'about-route',
});

const createRouter = (routes: any[]) =>
  new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
      ...routes.reduce((a, b) => a.concat(b), []),
      {
        path: '/',
        component: () => import('@/layouts/default.layout.vue'),
        children: [
          { path: '/about', name: MAIN_ROUTES.ABOUT, component: () => import('@/routes/about/about.route.vue') },
          { path: '', name: MAIN_ROUTES.HOME, component: () => import('@/routes/home/home.route.vue') },
        ],
      },
    ],
  });

export default createRouter;
