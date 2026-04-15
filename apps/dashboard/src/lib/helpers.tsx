/* eslint-disable @typescript-eslint/no-unused-vars */
import CryptoJS from "crypto-js";
import { v4 as uuidV4 } from "uuid";

import CONFIG from "@/configs/app";

export function getDeviceID() {
  const deviceID = uuidV4();
  const isExist = localStorage.getItem("deviceID");
  if (isExist) return isExist;

  localStorage.setItem("deviceID", deviceID);
  return deviceID;
}

export function encrypt(text: string) {
  try {
    const encrypted = CryptoJS.AES.encrypt(text, CONFIG.encryptionKey, {
      iv: CONFIG.encryptionIV
    }).toString();
    const encoded = CryptoJS.enc.Base64.parse(encrypted).toString(CryptoJS.enc.Hex);
    return encoded;
  } catch (e) {
    return null;
  }
}

export function decrypt(encrypted: string) {
  try {
    const decoded = CryptoJS.enc.Hex.parse(encrypted).toString(CryptoJS.enc.Base64);
    const decrypted = CryptoJS.AES.decrypt(decoded, CONFIG.encryptionKey, {
      iv: CONFIG.encryptionIV
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (e) {
    return null;
  }
}

export function parser(string: string) {
  try {
    return JSON.parse(string);
  } catch (e) {
    return null;
  }
}

export function findMedian(arr: any[]) {
  arr.sort((a, b) => a - b);
  const middleIndex = Math.floor(arr.length / 2);

  return arr[middleIndex];
}

export function formatDate(date: string | undefined | null, withSecond: boolean = true) {
  if (!date) return "";

  return new Date(date).toLocaleString("en-EN", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    ...(withSecond && { second: "2-digit" }),
    hour12: false
  });
}

export function getInitialLetter(name: string) {
  return name.charAt(0);
}

export function countMonthsInRange(startDate: Date, endDate: Date) {
  const startYear = startDate.getFullYear();
  const startMonth = startDate.getMonth();
  const endYear = endDate.getFullYear();
  const endMonth = endDate.getMonth();

  const months = (endYear - startYear) * 12 + (endMonth - startMonth);
  return months;
}

export function getAppName() {
  return CONFIG.appName.toLowerCase().replace(/\s+/g, "-");
}