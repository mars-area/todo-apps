export const log = {
  info: (str: any) => {
    console.info(`[${new Date().toISOString()}] - ${str}`);
  },
  error: (str: any, err?: any, req?: any) => {
    const statusCode = err?.statusCode || 500;
    const message = err?.message || "An error occurred";
    const url = req?.originalUrl;
    const method = req?.method ?? undefined;
    const stack = err?.stack ?? undefined;
    console.error(
      `[${new Date().toISOString()}] - ${statusCode} - ${str ? `${str} - ${message}` : message} - ${url} - ${method} - Stack: ${stack}`,
      err
    );
  },
  warn: (str: any, err: any) => {
    console.warn(`[${new Date().toISOString()}] - ${str}`, err);
  },
  debug: (str: any, err: any) => {
    console.debug(`[${new Date().toISOString()}] - ${str}`, err);
  }
};
