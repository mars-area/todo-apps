import { apiErrorHandler } from "@/hooks/api-error-handler";

import useAuthStore from "@/stores/auth";

import { logoutApi, refreshTokenApi } from "@/api";

import type { TApiError } from "@/types/general";
import { getAppName } from "@/lib/helpers";

const { setLoginDataAction } = useAuthStore.getState();

export async function logoutAction(callback?: () => void) {
  try {
    await logoutApi();
  } catch (_e) {
    return // assume will success
  } finally {
    setLoginDataAction({
      loggedIn: false,
      userData: null,
      token: null
    });

    localStorage.removeItem(`${getAppName()}-session-data`);
    if (callback) callback();
  }
}

export async function refreshTokenAction() {
  try {
    return await refreshTokenApi();
  } catch (error: unknown) {
    apiErrorHandler(error as TApiError);
  }
}
