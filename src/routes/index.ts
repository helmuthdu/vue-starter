import { loadLanguageAsync, LocaleLanguages } from '@/locales';
import { USER_ROUTE_NAME } from '@/modules/user/routes/paths';
import { UserActionTypes } from '@/modules/user/stores/modules/user';
import { store } from '@/stores';
import { createRouter, createWebHistory, Router, RouteRecordRaw } from 'vue-router';

export let router: Router;

export const buildRouter = (routes: Array<RouteRecordRaw>[]): Router => {
  if (router) {
    return router;
  }

  router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes: [
      ...routes.flat(),
      {
        path: '/not-found',
        name: 'not-found',
        component: () => import('@/routes/not-found/not-found.route.vue')
      },
      {
        path: '/:pathMatch(.*)*',
        redirect: { name: 'not-found' }
      }
    ] as Array<RouteRecordRaw>
  });

  router.beforeEach(async (to, from, next) => {
    const lang = to.params.lang as LocaleLanguages;
    await loadLanguageAsync(lang);
    const isLoggedIn = store.getters[UserActionTypes.IS_LOGGED_IN];
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    return requiresAuth && !isLoggedIn ? next({ name: USER_ROUTE_NAME.SIGN_IN }) : next();
  });

  return router;
};
