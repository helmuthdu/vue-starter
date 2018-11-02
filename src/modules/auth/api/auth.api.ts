import axios from 'axios';

export interface AuthenticatePayload {
  email: string;
  password: string;
}

const get = (payload: AuthenticatePayload) =>
  axios.post(`https://httpstat.us/200`, {
    username: payload.email,
    password: payload.password,
  });

export const authApi = {
  get,
};
