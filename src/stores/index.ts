import * as userModule from '../modules/user/stores';

type StoreName = userModule.user.Name;

export const useStore = (name: StoreName) => {
  switch (name) {
    case 'user':
      return userModule.user.useStore();
    default:
      throw new Error('Store not found');
  }
};
