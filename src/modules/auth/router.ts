import SignInPage from '@/modules/auth/routes/sign-in/sign-in.page.vue';

export const AUTHENTICATION_ROUTES = Object.freeze({
  SIGN_IN: 'auth-sign-in-route'
});

export const authRoutes = [
  {
    path: '/sign-in',
    component: () => import('@/layout/empty.layout.vue'),
    children: [{ path: '', name: AUTHENTICATION_ROUTES.SIGN_IN, component: SignInPage }]
  }
];

export default authRoutes;
