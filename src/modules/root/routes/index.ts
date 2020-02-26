export enum ROOT_ROUTES {
  HOME = 'home-route',
  ABOUT = 'about-route'
}

export enum ROOT_PATHS {
  ROOT = '/',
  HOME = '/',
  ABOUT = '/about'
}

export const routes = [
  {
    path: ROOT_PATHS.ROOT,
    component: () => import('../layouts/default.layout.vue'),
    children: [
      {
        path: ROOT_PATHS.ABOUT,
        name: ROOT_ROUTES.ABOUT,
        component: () => import('./about/about.route.vue')
      },
      {
        path: ROOT_PATHS.HOME,
        name: ROOT_ROUTES.HOME,
        component: () => import('./home/home.route.vue')
      }
    ]
  }
];
