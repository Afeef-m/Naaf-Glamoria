
import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

type RetryConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

const adminApi = axios.create({
  baseURL: "/api/admin",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let refreshPromise: Promise<void> | null = null;

adminApi.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryConfig | undefined;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/refresh") ||
      originalRequest.url?.includes("/auth/logout")
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = axios
          .post("/api/admin/auth/refresh", null, {
            withCredentials: true,
          })
          .then(() => undefined)
          .finally(() => {
            refreshPromise = null;
          });
      }

      await refreshPromise;

      return adminApi(originalRequest);
    } catch (refreshError) {
      if (typeof window !== "undefined") {
        window.location.assign("/admin/login");
      }

      return Promise.reject(refreshError);
    }
  }
);

export default adminApi;
