import appModules from '../modules';
import * as notificationStore from './notification.store';

export const stores = {
  ...Object.values(appModules.stores).reduce(
    (acc, store) => {
      acc[store.name] = store.store;
      return acc;
    },
    {} as {
      [key in keyof typeof appModules.stores]: (typeof appModules.stores)[key]['store'];
    },
  ),
  [notificationStore.name]: notificationStore.store,
};

export const useStore = () => ({
  ...Object.values(appModules.stores).reduce(
    (acc, store) => {
      acc[store.name] = store.useStore();
      return acc;
    },
    {} as {
      [key in keyof typeof appModules.stores]: ReturnType<(typeof appModules.stores)[key]['useStore']>;
    },
  ),
  [notificationStore.name]: notificationStore.useStore(),
});
