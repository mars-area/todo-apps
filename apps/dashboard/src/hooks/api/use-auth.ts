import { useMutation } from "@tanstack/react-query";

import CONFIG from "@/configs/app";
import { apiErrorHandler } from "@/hooks/api-error-handler";
import { forgotPasswordApi, loginApi, resetPasswordApi, signupApi } from "@/api";

import useAuthStore from "@/stores/auth";

import type { TApiError } from "@/types/general";
import type { IForgotPasswordActionData, ILoginActionData, IResetPasswordActionData, ISignupActionData } from "@/types/auth";

const { setLoginDataAction } = useAuthStore.getState();

export const useAuthLogin = () => {
  return useMutation({
    mutationFn: ({ data }: { data: ILoginActionData; callback?: () => void }) => {
      return loginApi({
        ...data,
        password: data.password + CONFIG.saltPassword
      });
    },
    onSuccess(response, props) {
      const { callback } = props;

      setLoginDataAction({
        loggedIn: true,
        userData: {
          name: response.data.data.name,
          email: response.data.data.email,
          role: response.data.data.role
        },
        token: response.data.data.token
      });

      if (callback) callback();
    },
    onError: (error: TApiError) => {
      apiErrorHandler(error, true);
    }
  });
};

export const useAuthSignup = () => {
  return useMutation({
    mutationFn: ({ data }: { data: ISignupActionData; callback?: () => void }) => {
      return signupApi(data);
    },
    onSuccess(response, props) {
      const { callback } = props;

      setLoginDataAction({
        loggedIn: true,
        userData: {
          name: response.data.data.name,
          email: response.data.data.email,
          role: response.data.data.role
        },
        token: response.data.data.token
      });

      if (callback) callback();
    },
    onError: (error: TApiError) => {
      apiErrorHandler(error, true);
    }
  });
};

export const useAuthForgotPassword = () => {
  return useMutation({
    mutationFn: ({ data }: { data: IForgotPasswordActionData; callback: () => void }) => {
      return forgotPasswordApi(data);
    },
    onSuccess(_, props) {
      const { callback } = props;

      callback();
    },
    onError: (error: TApiError) => {
      apiErrorHandler(error, true);
    }
  });
};

export const useAuthResetPassword = () => {
  return useMutation({
    mutationFn: ({ data }: { data: IResetPasswordActionData; callback: () => void }) => {
      return resetPasswordApi(data);
    },
    onSuccess(_, props) {
      const { callback } = props;

      callback();
    },
    onError: (error: TApiError) => {
      apiErrorHandler(error, true);
    }
  });
};
