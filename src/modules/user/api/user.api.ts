import { Http, Logger } from '@/utils';
import { UserSchema } from '../entities/user';

export type UserRequest = Partial<UserSchema> & {
  email: string;
  password: string;
};

const signIn = async (payload: UserSchema): Promise<Response & { data: UserSchema }> => {
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
      } as any);
    }, 1000);
  });
};

const signUp = async (payload: UserSchema) =>
  Http.post<UserSchema>(`${import.meta.env.VITE_API_URL}/users/sign-up`, { data: payload });

const update = async (payload: UserSchema) =>
  Http.put<UserSchema>(`${import.meta.env.VITE_API_URL}/users`, { data: payload });

export const userApi = {
  signIn,
  signUp,
  update,
};
