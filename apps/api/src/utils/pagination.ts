import type { Request } from "express";

export interface IQueryParams extends Record<string, unknown> {
  page?: number;
  limit?: number;
  sort?: string;
  order?: string;
  search?: string;
  dateStart?: string;
  dateEnd?: string;
}

export function useQuery(req: Request) {
  const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
  const limit = req.query.limit ? Math.min(parseInt(req.query.limit as string, 10), 100) : 10;
  const offset = (page - 1) * limit;
  const sort = req.query.sort ? (req.query.sort as string) : "createdAt";
  const order = req.query.order === "DESC" ? "DESC" : "ASC";
  const dateStart = (req.query.dateStart as string) || undefined;
  const dateEnd = (req.query.dateEnd as string) || undefined;
  const status = (req.query.status as string) || "all";
  const type = (req.query.type as string) || "all";
  const gameId = (req.query.gameId as string) || undefined;
  const search = (req.query.search as string) || undefined;

  return { limit, offset, page, sort, order, dateStart, dateEnd, status, type, gameId, search };
}
