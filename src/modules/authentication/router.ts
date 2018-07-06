import SignInPage from '@/modules/authentication/pages/sign-in/sign-in.page.vue';

export const AUTHENTICATION_ROUTES = Object.freeze({
  SIGN_IN: 'authentication-sign-in-route',
});

export const authenticationRoutes = [
  {
    path: '/authentication/sign-in',
    component: () => import('@/layout/empty.layout.vue'),
    children: [
      { path: '', name: AUTHENTICATION_ROUTES.SIGN_IN, component: SignInPage },
    ],
  },
];
