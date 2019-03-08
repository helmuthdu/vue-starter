export const AUTHENTICATION_ROUTES = Object.freeze({
  SIGN_IN: 'auth-sign-in-route',
});

export const authRoutes = [
  {
    path: '/sign-in',
    component: () => import('@/modules/auth/layouts/empty.layout.vue'),
    children: [{ path: '', name: AUTHENTICATION_ROUTES.SIGN_IN, component: () => import('@/modules/auth/routes/sign-in/sign-in.route.vue') }],
  },
];

export default authRoutes;
