// Create this in a separate file like utils/api.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3002',
  withCredentials: true
});

export default apiClient;