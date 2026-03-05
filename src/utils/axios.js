import axios from "axios";

const api = axios.create({
  baseURL: "http://10.117.9.40:8080",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => {
    const csrfToken = response.headers["x-xsrf-token"];

    if (csrfToken) {
      api.defaults.headers.common["X-XSRF-TOKEN"] = csrfToken;
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
