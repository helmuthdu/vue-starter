import { defineAsyncComponent } from 'vue';
import { createRouter, createWebHistory, Router } from 'vue-router';
import { loadTranslations, Locale, locales } from '@/locales';
import { paths, routes } from '@/modules';
import { useStore } from '@/stores';
import { startPageProgressBar, stopPageProgressBar } from '@/utils/progress-bar.util';
import DefaultLayout from '../layouts/default.layout.vue';

export const router: Router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(_to, _from, scrollPosition) {
    if (scrollPosition) {
      return scrollPosition;
    } else {
      return { top: 0 };
    }
  },
  routes: [
    {
      path: '/',
      redirect: { path: `/${locales.english}/` },
    },
    {
      path: '/:locale',
      component: DefaultLayout,
      beforeEnter: (to, _from, next) => {
        loadTranslations(to.params.locale as Locale)
          .then(() => {
            next();
          })
          .catch(() => {
            next({ name: '404' });
          });
      },
      children: [...routes],
    },
    {
      path: '/network-error',
      name: 'NetworkError',
      component: defineAsyncComponent(() => import('./network-error/network-error.route.vue')),
    },
    {
      path: '/404/:resource',
      name: '404Resource',
      component: () => defineAsyncComponent(() => import('./not-found/not-found.route.vue')),
      props: true,
    },
    {
      path: '/:pathMatch(.*)*',
      name: '404',
      component: () => defineAsyncComponent(() => import('./not-found/not-found.route.vue')),
    },
  ],
});

router.beforeEach(async (to, _from, next) => {
  startPageProgressBar();

  const store = useStore();
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  requiresAuth && !store.user.isLoggedIn ? next({ name: paths.user.signIn.path }) : next();
});

router.afterEach(() => {
  stopPageProgressBar();
});
