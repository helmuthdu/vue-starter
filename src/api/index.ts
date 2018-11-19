import axios from 'axios';

const baseDomain: string = 'https://localhost';
const baseURL: string = `${baseDomain}/api`;

export default axios.create({
  baseURL
})
