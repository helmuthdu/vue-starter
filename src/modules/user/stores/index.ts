import * as userStore from './user.store';

export const stores = {
  [userStore.name]: {
    store: userStore.userStore,
    useStore: userStore.useUserStore,
  },
};
