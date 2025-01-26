import { type Locale, locales, setCurrentLocale } from '@/locales';
import { paths, routes } from '@/modules';
import { stores } from '@/stores';
import { Logger } from '@/utils/logger.util';
import { type Router, createRouter, createWebHistory } from 'vue-router';

export const router: Router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(_to, _from, scrollPosition) {
    if (scrollPosition) {
      return scrollPosition;
    }
    return { top: 0 };
  },
  routes: [
    {
      path: '/',
      redirect: { path: `/${locales.english}/` },
    },
    {
      path: '/:locale',
      component: () => import('../layouts/default.layout.vue'),
      beforeEnter: (to, _from, next) => {
        try {
          setCurrentLocale(to.params.locale as Locale);
          next();
        } catch (err) {
          Logger.error(err);
          next({ name: '404' });
        }
      },
      children: [...routes],
    },
    {
      path: '/network-error',
      name: 'NetworkError',
      component: () => import('./network-error/network-error.route.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: '404',
      component: () => import('./not-found/not-found.route.vue'),
    },
  ],
});

router.beforeEach(async (to, _from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const { user: userStore } = stores;

  requiresAuth && !userStore.getters.isLoggedIn ? next({ name: paths.user.signIn.path }) : next();
});
