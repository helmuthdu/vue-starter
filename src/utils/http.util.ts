import axios from 'axios';

const baseDomain = process.env.BASE_DOMAIN;
const baseURL = `${baseDomain}/api`;

const http = axios.create({
  baseURL
});

export default http;
