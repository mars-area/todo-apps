import { Op, type FindAndCountOptions } from "sequelize";

export interface CursorPaginationParams {
  sort?: string;
  order?: "ASC" | "DESC";
  cursor?: string | null;
  limit?: number;
}

export interface CursorPaginationMeta {
  total: number;
  limit: number;
  cursor: string | null;
  nextCursor: string | null;
  hasMore: boolean;
}

/**
 * Parse cursor pagination parameters from query
 */
export const parseCursorParams = (query: Record<string, any>): CursorPaginationParams => {
  return {
    sort: (query.sort as string) || "id",
    order: ((query.order as string) || "DESC").toUpperCase() as "ASC" | "DESC",
    cursor: (query.cursor as string) || null,
    limit: Math.min(parseInt(query.limit as string) || 10, 100) // Cap at 100
  };
};

/**
 * Build Sequelize where clause for cursor-based pagination
 */
export const buildCursorWhere = (sort: string, order: "ASC" | "DESC", cursor: string | null): any => {
  if (!cursor) return {};

  const [sortValue, idValue] = cursor.split("|");
  const comparison = order === "DESC" ? Op.lt : Op.gt;

  return {
    [Op.or]: [
      { [sort]: { [comparison]: sortValue } },
      {
        [Op.and]: [{ [sort]: sortValue }, { id: order === "DESC" ? { [Op.lt]: idValue } : { [Op.gt]: idValue } }]
      }
    ]
  };
};

/**
 * Build cursor from the last record
 */
export const buildCursor = (record: any, sort: string): string => {
  const sortValue = record?.get ? record.get()[sort] : record[sort];
  const parsedSortValue = sortValue ? sortValue.toISOString() : sortValue;
  const idValue = record?.get ? record.get().id : record.id;
  return Buffer.from(JSON.stringify({ createdAt: parsedSortValue, id: idValue })).toString("base64");
  // return `${parsedSortValue}|${idValue}`;
};

/**
 * Process paginated results and generate metadata
 */
export const processCursorPagination = (
  rows: any[],
  total: number,
  limit: number,
  sort: string,
  cursor: string | null
): { rows: any[]; meta: CursorPaginationMeta } => {
  const hasMore = rows.length > limit;
  const paginatedRows = hasMore ? rows.slice(0, limit) : rows;
  const nextCursor = hasMore ? buildCursor(paginatedRows[paginatedRows.length - 1], sort) : null;

  return {
    rows: paginatedRows,
    meta: {
      total,
      limit,
      cursor,
      nextCursor,
      hasMore
    }
  };
};

/**
 * Build Sequelize findAndCountAll options for cursor pagination
 * @example
 * const options = buildCursorFindOptions({
 *   sort: 'createdAt',
 *   order: 'DESC',
 *   cursor: null,
 *   limit: 10
 * });
 * const data = await Users.findAndCountAll(options);
 */
export const buildCursorFindOptions = (
  params: CursorPaginationParams,
  additionalOptions?: Partial<FindAndCountOptions>
): Partial<FindAndCountOptions> => {
  const { sort, order, cursor, limit } = params;
  const defaultSort = sort || "createdAt";
  const defaultOrder = order || "DESC";

  return {
    where: buildCursorWhere(defaultSort, defaultOrder, cursor || null),
    order: [
      [defaultSort, defaultOrder],
      ["id", defaultOrder]
    ],
    limit: (limit || 10) + 1, // Fetch one extra to check if there are more
    ...additionalOptions
  };
};
