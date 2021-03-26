import { loadLanguageAsync, LocaleLanguages } from '@/locales';
import { paths, routes } from '@/modules';
import { UserActionTypes } from '@/modules/user/stores/modules/user';
import { store } from '@/stores';
import { createRouter, createWebHistory, Router } from 'vue-router';

export const router: Router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: [
    ...routes,
    {
      path: '/not-found',
      name: 'not-found',
      component: () => import('@/routes/not-found/not-found.route.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: { name: 'not-found' }
    }
  ]
});

router.beforeEach(async (to, from, next) => {
  const lng = to.params.lang as LocaleLanguages;
  await loadLanguageAsync(lng);
  const isLoggedIn = store.getters[UserActionTypes.IS_LOGGED_IN];
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  return requiresAuth && !isLoggedIn ? next({ name: paths.user.signIn.path }) : next();
});
