import { RouteRecordRaw } from 'vue-router';
import { paths } from '@/modules/user/routes/paths';

export const routes: Array<RouteRecordRaw> = [
  {
    path: paths.path,
    component: () => import('../layouts/user.layout.vue'),
    children: [
      {
        path: paths.signIn.path,
        name: paths.signIn.name,
        component: () => import('./sign-in/sign-in.route.vue'),
      },
    ],
  },
];
