import { defineAsyncComponent } from 'vue';
import { RouteRecordRaw } from 'vue-router';
import { paths } from './paths';

export const routes: Array<RouteRecordRaw> = [
  {
    path: paths.root,
    component: () => defineAsyncComponent(() => import('../layouts/main.layout.vue')),
    children: [
      {
        path: paths.about.path,
        name: paths.about.name,
        component: () => defineAsyncComponent(() => import('./about/about.route.vue')),
      },
      {
        path: paths.home.path,
        name: paths.home.name,
        component: () => defineAsyncComponent(() => import('./home/home.route.vue')),
      },
    ],
  },
];
