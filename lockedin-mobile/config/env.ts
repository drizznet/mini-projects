const localApi =
  process.env.EXPO_PUBLIC_API_BASE_URL_LOCAL ?? "http://localhost:4400";
const productionApi =
  process.env.EXPO_PUBLIC_API_BASE_URL_PRODUCTION ??
  "https://bobslab.onrender.com";

const environment = (
  process.env.EXPO_PUBLIC_ENVIRONMENT ??
  (__DEV__ ? "local" : "production")
).toLowerCase();

export const API_BASE_URL =
  environment === "local" ? localApi : productionApi;

export const APP_ENVIRONMENT = environment;
