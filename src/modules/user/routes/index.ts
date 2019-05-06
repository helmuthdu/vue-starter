export enum USER_ROUTES {
  SIGN_IN = 'auth-sign-in-route'
}

export const routes = [
  {
    path: '/sign-in',
    component: () => import('../layouts/empty.layout.vue'),
    children: [
      {
        path: '',
        name: USER_ROUTES.SIGN_IN,
        component: () => import('./sign-in/sign-in.route.vue')
      }
    ]
  }
];
