import * as userModule from '../modules/user/stores';

export const useStore = () => ({
  user: userModule.user.useStore(),
});
