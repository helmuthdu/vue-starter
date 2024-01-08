import * as userModule from '../modules/user/stores';

export const useStore = () => ({
  [userModule.user.name]: userModule.user.useStore(),
});
