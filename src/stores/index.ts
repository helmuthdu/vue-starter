import appModules from '../modules';
import * as notificationStore from './notification.store';

export const stores = {
  ...Object.entries(appModules.stores).reduce(
    (acc, [name, { store }]) => {
      acc[name as keyof typeof appModules.stores] = store;
      return acc;
    },
    {} as {
      [key in keyof typeof appModules.stores]: (typeof appModules.stores)[key]['store'];
    },
  ),
  [notificationStore.name]: notificationStore.notificationStore,
};

export const useStore = () => ({
  ...Object.entries(appModules.stores).reduce(
    (acc, [name, { useStore }]) => {
      acc[name as keyof typeof appModules.stores] = useStore();
      return acc;
    },
    {} as {
      [key in keyof typeof appModules.stores]: ReturnType<(typeof appModules.stores)[key]['useStore']>;
    },
  ),
  [notificationStore.name]: notificationStore.useNotificationStore(),
});
