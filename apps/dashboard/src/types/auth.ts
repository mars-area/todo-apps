export interface IAuthStore {
  loggedIn: boolean;
  data: ILoggedInUser | null;
  token: IUserAccess | null;

  setLoginDataAction: (data: ISetLoginDataActionProps) => void;
}

export interface ILoggedInUser {
  name: string;
  email: string;
}

export interface IUserAccess {
  access: string;
  refresh: string;
}

export interface ISetLoginDataActionProps {
  loggedIn: boolean;
  userData: ILoggedInUser | null;
  token: IUserAccess | null;
}

export interface ILoginActionData {
  email: string;
  password: string;
}

export interface IForgotPasswordActionData {
  email: string;
}

export interface IResetPasswordActionData {
  token: string;
  password: string;
}

export interface ISignupActionData {
  name: string;
  email: string;
  password: string;
}