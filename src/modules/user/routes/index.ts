import { paths } from '@/modules/user/routes/paths';
import { defineAsyncComponent } from 'vue';
import { RouteRecordRaw } from 'vue-router';

export const routes: Array<RouteRecordRaw> = [
  {
    path: paths.root,
    component: () => defineAsyncComponent(() => import('../layouts/user.layout.vue')),
    children: [
      {
        path: paths.signIn.path,
        name: paths.signIn.name,
        component: () => defineAsyncComponent(() => import('./sign-in/sign-in.route.vue'))
      }
    ]
  }
];
