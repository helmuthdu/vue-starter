import { paths } from '@/modules/user/routes/paths';
import { RouteRecordRaw } from 'vue-router';

export const routes: Array<RouteRecordRaw> = [
  {
    path: paths.root,
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
