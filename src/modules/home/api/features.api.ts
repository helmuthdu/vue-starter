import type { Feature } from '@/modules/home/models/feature/feature.type';

const get = (): Promise<Feature[]> => import('./features.json').then((res) => res.default);

export const featuresApi = {
  get,
};
