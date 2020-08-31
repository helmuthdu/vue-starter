import { ROOT_PATHS, ROOT_ROUTE_NAME } from '@/modules/root/routes/paths';
import { RouteRecordRaw } from 'vue-router';

export const routes: Array<RouteRecordRaw> = [
  {
    path: ROOT_PATHS.ROOT,
    component: () => import('../layouts/default.layout.vue'),
    children: [
      {
        path: ROOT_PATHS.ABOUT,
        name: ROOT_ROUTE_NAME.ABOUT,
        component: () => import('./about/about.route.vue')
      },
      {
        path: ROOT_PATHS.HOME,
        name: ROOT_ROUTE_NAME.HOME,
        component: () => import('./home/home.route.vue')
      }
    ]
  }
];
