import type { Feature } from '@/modules/main/models/feature/feature.type';

const get = (): Promise<Feature[]> => import('./features.json').then((res) => res.default);

export const featuresApi = {
  get,
};
