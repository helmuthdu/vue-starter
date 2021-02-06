import { ROOT_ROUTE_PATH, ROOT_ROUTE_NAME } from '@/modules/root/routes/paths';
import { RouteRecordRaw } from 'vue-router';

export const routes: Array<RouteRecordRaw> = [
  {
    path: ROOT_ROUTE_PATH.ROOT,
    component: () => import('../layouts/root.layout.vue'),
    children: [
      {
        path: ROOT_ROUTE_PATH.ABOUT,
        name: ROOT_ROUTE_NAME.ABOUT,
        component: () => import('./about/about.route.vue')
      },
      {
        path: ROOT_ROUTE_PATH.HOME,
        name: ROOT_ROUTE_NAME.HOME,
        component: () => import('./home/home.route.vue')
      }
    ]
  }
];
