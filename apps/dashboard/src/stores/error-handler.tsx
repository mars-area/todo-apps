import { create } from "zustand";

type ErrorHandlerStore = {
  errors:
    | {
        code: number;
        message: string;
      }[]
    | any[];
  pushErrorAction: ({ code, message }: { code: number; message: string }) => void;
  resetErrorHandlerStoreAction: () => void;
};

const initialState = {
  errors: []
};

const useErrorHandlerStore = create<ErrorHandlerStore>((set, get) => ({
  ...initialState,
  pushErrorAction: ({ code, message }: { code: number; message: string }) => {
    const { errors } = get();

    try {
      set({
        errors: errors.some((item: any) => item.code === code) ? errors : [...errors, ...[{ code, message }]]
      });
    } catch (error) {
      console.error(error);
    }
  },
  resetErrorHandlerStoreAction: () => {
    set(initialState);
  }
}));

export default useErrorHandlerStore;
