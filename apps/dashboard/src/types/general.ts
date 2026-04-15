import { AxiosError } from "axios";

export interface ApiResponse {
  message?: string;
  error?: string;
  data?: unknown;
}

export type TApiError = AxiosError<ApiResponse>;

export interface IQueryParams extends Record<string, unknown> {
  page?: number;
  limit?: number;
  sort?: string;
  order?: string;
  search?: string;
  dateStart?: string;
  dateEnd?: string;
  status?: string;
  category?: string;
  filter?: string;
  type?: string;
}

export interface IPaginations {
  total: number;
  page: number;
  limit: number;
  totalPage: number;
}

export interface IApiParamsStore extends IQueryParams {
  getParamsAction: () => IQueryParams;
  setParamsAction: (params: IQueryParams) => void;
  resetParamsAction: () => void;
}
