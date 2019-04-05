export enum HOME_ROUTES {
  HOME = 'home-route',
  ABOUT = 'about-route'
}

export const routes = [
  {
    path: '/',
    component: () => import('../layouts/default.layout.vue'),
    children: [
      {
        path: '/about',
        name: HOME_ROUTES.ABOUT,
        component: () => import('./about/about.route.vue')
      },
      {
        path: '',
        name: HOME_ROUTES.HOME,
        component: () => import('./home/home.route.vue')
      }
    ]
  }
];
