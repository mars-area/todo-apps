import axios, { type AxiosHeaders, type AxiosRequestConfig } from "axios";

import { CONFIG } from "@/configs/app";

import type { IForgotPasswordActionData, ILoginActionData, IResetPasswordActionData, ISignupActionData, IUserAccess } from "@/types/auth";
import useAuthStore from "@/stores/auth";
import { logoutAction, refreshTokenAction } from "@/hooks/actions/auth";

export const API_URL = `${CONFIG.apiUrl}/`;
export const BEARER = CONFIG.apiBearer;

const headers = {
  Authorization: `Bearer ${BEARER}`
};

const instance = axios.create({
  baseURL: API_URL,
  headers,
  withCredentials: true
});

const instanceClient = () => {
  instance.interceptors.request.use((config) => {
    const { token } = useAuthStore.getState();
    config.headers["x-access-token"] = token?.access;
    config.headers["x-refresh-token"] = token?.refresh;
    return config;
  });

  instance.interceptors.response.use(
    async (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      const errorStatusCode = error.response?.status;
      const errorResponseDataMessage = error.response?.data?.message || error.responseData;

      // Check if the error is 401 and message is "Access token expired"
      if (errorStatusCode === 401 && errorResponseDataMessage === "Access token expired." && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // Call refresh token API
          const refreshResponse = await refreshTokenAction();
          const refreshData = refreshResponse!.data.data;

          // Update the auth store with new tokens
          const tokenData = useAuthStore.getState();
          if (tokenData && refreshData.token) {
            useAuthStore.setState({
              token: {
                ...tokenData.token,
                access: refreshData.token.access
              } as IUserAccess
            });
          }

          // Update the original request headers with new access token
          if (refreshData.token?.access) {
            originalRequest.headers["x-access-token"] = refreshData.token.access;
          }

          // Retry the original request
          return instance(originalRequest);
        } catch (refreshError) {
          // If refresh fails, logout the user
          logoutAction();
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return {
    get: (url: string, data?: AxiosRequestConfig<unknown> | undefined) => instance.get(url, data),
    post: (url: string, data?: unknown, config?: AxiosRequestConfig<AxiosHeaders | undefined>) =>
      instance.post(url, data, config),
    patch: (url: string, data?: unknown, config?: AxiosRequestConfig<unknown> | undefined) =>
      instance.patch(url, data, config),
    put: (url: string, data?: unknown, config?: AxiosRequestConfig<AxiosHeaders | undefined>) =>
      instance.put(url, data, config),
    delete: (url: string) => instance.delete(url)
  };
};

const api = instanceClient();

// auth
export const loginApi = (data: ILoginActionData) => api.post("/auth/signin/email", data);
export const signupApi = (data: ISignupActionData) => api.post("/auth/signup/email", data);
export const logoutApi = () => api.post("/auth/signout");
export const refreshTokenApi = () => api.post("/auth/refresh");
export const forgotPasswordApi = (data: IForgotPasswordActionData) => api.post("/auth/forgot-password", data);
export const resetPasswordApi = (data: IResetPasswordActionData) => api.post("/auth/reset-password", data);

// users
export const getUserDetailApi = (uid: string) => api.get(`/users/${uid}`);