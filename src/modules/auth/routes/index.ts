export const AUTHENTICATION_ROUTES = Object.freeze({
  SIGN_IN: 'auth-sign-in-route'
});

export const routes = [
  {
    path: '/sign-in',
    component: () => import('../layouts/empty.layout.vue'),
    children: [
      {
        path: '',
        name: AUTHENTICATION_ROUTES.SIGN_IN,
        component: () => import('./sign-in/sign-in.route.vue')
      }
    ]
  }
];
