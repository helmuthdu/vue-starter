import { Feature } from '@/modules/main/entities/feature/feature.type';

const get = (): Promise<Feature[]> => import('./features.json').then((res) => res.default);

export const featuresApi = {
  get,
};
