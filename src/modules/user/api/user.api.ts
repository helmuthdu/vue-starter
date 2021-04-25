export interface AuthenticatePayload {
  email: string;
  password: string;
}

const get = (payload: AuthenticatePayload): any => {
  console.log(`requesting user for ${payload.email}`);
  return new Promise(resolve => {
    resolve({
      username: 'user_name',
      email: 'user_email',
      token: 'user_token',
      isLogged: true
    });
  });
};

export const userApi = {
  get
};
