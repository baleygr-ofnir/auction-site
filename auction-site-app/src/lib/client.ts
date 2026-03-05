import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000',
    withCredentials: false,
});

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
    authToken = token;
}

api.interceptors.request.use(
    config => {
        if (authToken) {
            config.headers = config.headers ?? {};
            config.headers.Authorization = `Bearer ${authToken}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

export default api;