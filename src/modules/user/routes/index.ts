import { USER_PATHS, USER_ROUTE_NAME } from '@/modules/user/routes/paths';
import { RouteRecordRaw } from 'vue-router';

export const routes: Array<RouteRecordRaw> = [
  {
    path: USER_PATHS.ROOT,
    component: () => import('../layouts/empty.layout.vue'),
    children: [
      {
        path: USER_PATHS.SIGN_IN,
        name: USER_ROUTE_NAME.SIGN_IN,
        component: () => import('./sign-in/sign-in.route.vue')
      }
    ]
  }
];
