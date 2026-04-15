import type { NextFunction, Request, Response } from "express";
import { randomBytes } from "crypto";
import config from "../configs/app";

type AsyncMiddleware = (_req: Request, _res: Response, _next?: NextFunction) => Promise<Response | void>;

export function catchAsync(fn: AsyncMiddleware) {
  return function (req: Request, res: Response, next?: NextFunction) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export interface ControllerRequestType extends Request {
  userId?: number;
  role?: string;
}

export const delay = (ms: number) => {
  // MILISECOND DELAY
  return new Promise(resolve => setTimeout(resolve, ms));
};

export function generateRandomHexString(length: number = 64) {
  return randomBytes(length / 2).toString("hex");
}

export const getAppName = () => {
  return config.app_name.toLowerCase().replace(/ /g, "-");
};

export const getDateRange = (start: string, end: string): string[] => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const dates: string[] = [];
  const current = new Date(startDate);
  while (current <= endDate) {
    dates.push(current.toISOString().split("T")[0]!);
    current.setDate(current.getDate() + 1);
  }
  return dates;
};

export const resetTimeStart = (inputDate: string) => {
  if (!inputDate) throw new Error("date is required");
  const datePart = inputDate.substring(0, 10);
  return `${datePart}T00:00:00.000Z`;
};

export const resetTimeEnd = (inputDate: string) => {
  if (!inputDate) throw new Error("date is required");
  const datePart = inputDate.substring(0, 10);
  return `${datePart}T23:59:59.000Z`;
};

export const shortenString = (str: string, startChars: number, endChars: number, delimiter: string) => {
  if (str.length <= startChars + endChars) {
    return str
  }
  return str.substring(0, startChars) + delimiter + str.substring(str.length - endChars)
}

export const formatBalance = (value = 0, maxDecimal = 2) => {
  return value?.toLocaleString("en-EN", { minimumFractionDigits: 0, maximumFractionDigits: maxDecimal });
};

export const formatDate = (dateString: string) => {
  const date = new Date(`${dateString}Z`)

  const options = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
    timeZoneName: 'short',
    hourCycle: 'h23'
  } as Intl.DateTimeFormatOptions

  return date.toLocaleString('en-US', options)
}