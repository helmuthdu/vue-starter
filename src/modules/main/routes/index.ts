import { paths } from './paths';
import { RouteRecordRaw } from 'vue-router';

export const routes: Array<RouteRecordRaw> = [
  {
    path: paths.root,
    component: () => import('../layouts/main.layout.vue'),
    children: [
      {
        path: paths.about.path,
        name: paths.about.name,
        component: () => import('./about/about.route.vue')
      },
      {
        path: paths.main.path,
        name: paths.main.name,
        component: () => import('./home/home.route.vue')
      }
    ]
  }
];
