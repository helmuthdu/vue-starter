import { Http } from '@/utils';
import { UserSchema } from '../models/user';

export type UserRequest = Partial<UserSchema> & {
  email: string;
  password: string;
};

const signIn = async (payload: UserSchema): Promise<Response & { data: UserSchema }> =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve({
        status: 400,
        data: {
          userName: 'johndoe',
          email: 'johndoe@mail.com',
          token: 'secret'
        }
      } as any);
    }, 1000);
  });

const signUp = async (payload: UserSchema) =>
  Http.post<UserSchema>(`${process.env.REACT_APP_IDENTITY_URL}/users/sign-up`, { data: payload });

const update = async (payload: UserSchema) =>
  Http.put<UserSchema>(`${process.env.REACT_APP_IDENTITY_URL}/users`, { data: payload });

export const userApi = {
  signIn,
  signUp,
  update
};
