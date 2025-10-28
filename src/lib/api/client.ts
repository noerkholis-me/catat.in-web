import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import { API_URL, ROUTES } from "../constants";

// Track if refresh is in progress
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve("");
    }
  });

  failedQueue = [];
};

const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // CRITICAL: Send cookies with requests
});

// Response interceptor - Handle errors & refresh token
apiClient.interceptors.response.use(
  (response) => {
    // Extract data from wrapper if exists
    if (response.data?.data) {
      return { ...response, data: response.data.data };
    }
    return response;
  },
  async (error: AxiosError<any>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Prevent infinite loop
      if (originalRequest.url?.includes("/auth/refresh")) {
        // Refresh token failed, redirect to login
        isRefreshing = false;
        processQueue(error);

        // Only redirect if not already on auth pages
        if (typeof window !== "undefined") {
          const currentPath = window.location.pathname;
          if (
            !currentPath.startsWith("/login") &&
            !currentPath.startsWith("/register")
          ) {
            window.location.href = ROUTES.LOGIN;
          }
        }

        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Another request is already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh token
        await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        // Refresh successful, retry all queued requests
        processQueue();
        isRefreshing = false;

        // Retry original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear queue and redirect to login
        processQueue(refreshError);
        isRefreshing = false;

        if (typeof window !== "undefined") {
          const currentPath = window.location.pathname;
          if (
            !currentPath.startsWith("/login") &&
            !currentPath.startsWith("/register")
          ) {
            window.location.href = ROUTES.LOGIN;
          }
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
