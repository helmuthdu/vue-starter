export enum HOME_ROUTES {
  HOME = 'home-route',
  ABOUT = 'about-route'
}

export const routes = [
  {
    path: '/',
    component: () => import('@/modules/home/layouts/default.layout.vue'),
    children: [
      {
        path: '/about',
        name: HOME_ROUTES.ABOUT,
        component: () => import('@/modules/home/routes/about/about.route.vue')
      },
      {
        path: '',
        name: HOME_ROUTES.HOME,
        component: () => import('@/modules/home/routes/home/home.route.vue')
      }
    ]
  }
];
