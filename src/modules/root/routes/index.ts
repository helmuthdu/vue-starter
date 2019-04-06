export enum ROOT_ROUTES {
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
        name: ROOT_ROUTES.ABOUT,
        component: () => import('./about/about.route.vue')
      },
      {
        path: '',
        name: ROOT_ROUTES.HOME,
        component: () => import('./home/home.route.vue')
      }
    ]
  }
];
