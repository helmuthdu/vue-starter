import { paths } from './paths';
import { RouteRecordRaw } from 'vue-router';

export const routes: Array<RouteRecordRaw> = [
  {
    path: paths.path,
    component: () => import('../layouts/home.layout.vue'),
    children: [
      {
        path: paths.about.path,
        name: paths.about.name,
        component: () => import('./about/about.route.vue')
      },
      {
        path: paths.home.path,
        name: paths.home.name,
        component: () => import('./home/home.route.vue')
      }
    ]
  }
];
