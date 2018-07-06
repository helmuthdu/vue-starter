import axios from 'axios';
import qs from 'qs';

export const requestUser = (payload: any) => axios.post(`https://httpstat.us/200`, qs.stringify({
  username: payload.email,
  password: payload.password,
}));
