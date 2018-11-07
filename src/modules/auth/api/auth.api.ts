export interface AuthenticatePayload {
  email: string;
  password: string;
}

const get = (payload: AuthenticatePayload): any => {
  return new Promise((resolve, reject) => {
    resolve({
      status: 200,
      data: {
        username: 'user_name',
        email: 'user_email',
        token: 'user_token',
        isLogged: true,
      }
    });
  });
};

export const authApi = {
  get,
};
