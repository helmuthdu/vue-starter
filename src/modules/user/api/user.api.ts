import type { UserJSON } from '@/modules/user/models/user';
import { Http } from '@/utils/http.util';
import { Logger } from '@/utils/logger.util';

export type UserRequest = Partial<UserJSON> & {
  email: string;
  password: string;
};

const signIn = async (payload: UserJSON): Promise<Response & { data: UserJSON }> => {
  Logger.debug('user.api::signIn()', payload);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: 400,
        data: {
          userName: 'johndoe',
          email: 'johndoe@mail.com',
          token: 'secret',
        },
      } as Response & { data: UserJSON });
    }, 1000);
  });
};

const signUp = async (payload: UserJSON) =>
  Http.post<UserJSON>(`${import.meta.env.VITE_API_URL}/users/sign-up`, { data: payload });

const update = async (payload: UserJSON) =>
  Http.put<UserJSON>(`${import.meta.env.VITE_API_URL}/users`, { data: payload });

export const userApi = {
  signIn,
  signUp,
  update,
};
