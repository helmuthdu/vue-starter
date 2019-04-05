import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const createRouter = (routes: any[]) =>
  new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
      ...routes.reduce((a, b) => a.concat(b), []),
      {
        path: '*',
        component: () => import('@/routes/not-found/not-found.route.vue')
      }
    ]
  });

export default createRouter;
