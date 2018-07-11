import axios from 'axios';
import qs from 'qs';

const get = (payload: any) => axios.post(`https://httpstat.us/200`, qs.stringify({
  username: payload.email,
  password: payload.password,
}));

export const authApi = {
  get,
};
