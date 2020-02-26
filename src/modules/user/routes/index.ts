export enum USER_ROUTES {
  SIGN_IN = 'auth-sign-in-route'
}

export enum USER_PATHS {
  ROOT = '/sign-in',
  SIGN_IN = '/'
}

export const routes = [
  {
    path: USER_PATHS.ROOT,
    component: () => import('../layouts/empty.layout.vue'),
    children: [
      {
        path: USER_PATHS.SIGN_IN,
        name: USER_ROUTES.SIGN_IN,
        component: () => import('./sign-in/sign-in.route.vue')
      }
    ]
  }
];
