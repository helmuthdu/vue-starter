import { loadTranslationsAsync, LocaleLanguages, isLanguageSupported } from '@/locales';
import { paths, routes } from '@/modules';
import { UserActionTypes } from '@/modules/user/stores/modules/user';
import { store } from '@/stores';
import { createRouter, createWebHistory, Router } from 'vue-router';
import DefaultLayout from '../layouts/default.layout.vue';

export const router: Router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: { path: `/${LocaleLanguages.English}/` }
    },
    {
      path: '/:locale',
      component: DefaultLayout,
      beforeEnter: (to, from, next) => {
        const locale = to.params.locale as LocaleLanguages;
        if (isLanguageSupported(locale)) {
          loadTranslationsAsync(locale).then(() => {
            next();
          });
        } else {
          next('/not-found');
        }
      },
      children: [...routes]
    },
    {
      path: '/not-found',
      name: 'not-found',
      component: () => import('./not-found/not-found.route.vue')
    }
  ]
});

router.beforeEach(async (to, from, next) => {
  const isLoggedIn = store.getters[UserActionTypes.IS_LOGGED_IN];
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  return requiresAuth && !isLoggedIn ? next({ name: paths.user.signIn.path }) : next();
});
