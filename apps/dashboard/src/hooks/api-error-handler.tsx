import { toast } from "sonner";

import { logoutAction } from "@/hooks/actions/auth";

import useErrorHandlerStore from "@/stores/error-handler";

import type { TApiError } from "@/types";

export const apiErrorHandler = (error: TApiError, showAlert?: boolean, callback?: (errorMessage: string) => void) => {
  const { pushErrorAction, resetErrorHandlerStoreAction, errors } = useErrorHandlerStore.getState();

  const defaultMessage = "Something went wrong.";
  const parsedError = error?.response?.data?.message || error.response?.data?.error || "";
  const errorStatus = error?.response?.status || 0;
  const errorMessage = parsedError || defaultMessage;

  if (errors.map((item) => item.code).includes(errorStatus)) {
    return;
  }

  pushErrorAction({
    code: errorStatus,
    message: parsedError
  });

  switch (errorStatus) {
    case 401:
      if (parsedError === "Invalid email or password") {
        if (showAlert) toast.error("Invalid email or password. Please try again.");
      } else {
        logoutAction();
        if (showAlert) toast.error("Unauthorized action detected we will sign out you. Please login again.");
      }
      break;
    case 403:
      if (parsedError === "Your account has been deactivated.") {
        if (showAlert) alert("Your account has been deactivated. Please contact our support.");
        logoutAction();
      } else {
        if (showAlert)
          toast.error("Oops!", {
            description: "You don't have permission to access this resource."
          });
      }
      break;
    case 440:
      toast.error("Oh no!", {
        description: "Your session has expired. Please login again."
      });
      logoutAction();
      break;
    default:
      if (showAlert) toast.error("Error!", { description: errorMessage });
      break;
  }

  setTimeout(() => {
    resetErrorHandlerStoreAction();
  }, 700);

  console.error(error);
  if (callback) callback(errorMessage);

  return { errorStatus, errorMessage };
};
