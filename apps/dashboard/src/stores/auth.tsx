import { create } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";

import type { IAuthStore, ISetLoginDataActionProps } from "@/types";
import { getAppName } from "@/lib/helpers";
import { encryptedPersistStorage } from "@/lib/encrypted-storage";

const initialState = {
  loggedIn: false,
  data: null,
  token: null
};

const useAuthStore = create<IAuthStore>()(
  subscribeWithSelector(
    persist(
      set => ({
        ...initialState,
        setLoginDataAction: (data: ISetLoginDataActionProps) => {
          set({
            loggedIn: data.loggedIn,
            data: data.userData,
            token: data.token
          });
        }
      }),
      {
        name: `${getAppName()}-session-data`,
        storage: encryptedPersistStorage,
        partialize: (state: IAuthStore) => {
          const { loggedIn, data, token } = state;
          return { loggedIn, data, token };
        }
      }
    )
  )
);

export default useAuthStore;
