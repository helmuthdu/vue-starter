import axios from 'axios';

const baseDomain = 'https://localhost';
const baseURL = `${baseDomain}/api`;

export default axios.create({
  baseURL
});
