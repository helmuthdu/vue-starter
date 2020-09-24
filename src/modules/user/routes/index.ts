import { USER_ROUTE_PATH, USER_ROUTE_NAME } from '@/modules/user/routes/paths';
import { RouteRecordRaw } from 'vue-router';

export const routes: Array<RouteRecordRaw> = [
  {
    path: USER_ROUTE_PATH.ROOT,
    component: () => import('../layouts/empty.layout.vue'),
    children: [
      {
        path: USER_ROUTE_PATH.SIGN_IN,
        name: USER_ROUTE_NAME.SIGN_IN,
        component: () => import('./sign-in/sign-in.route.vue')
      }
    ]
  }
];
