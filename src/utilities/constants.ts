const APP_URL = process.env.VUE_APP_APP_URL;
const API_BASE_URL = process.env.VUE_APP_API_BASE_URL;
const ZOHO_CLIENT_ID = process.env.VUE_APP_ZOHO_CLIENT_ID;
const ZOHO_SCOPES = process.env.VUE_APP_ZOHO_SCOPES;
const ZOHO_REDIRECT_URI_PATH = process.env.VUE_APP_ZOHO_REDIRECT_URI_PATH;

const LOCAL_DOMAIN = "http://localhost:8065";
const IS_LOCAL_HOST = window.location.hostname === "localhost" ? true : false;

export interface IConstants {
  APP_URL: string;
  API_BASE_URL: string;
  ZOHO_CLIENT_ID: string;
  ZOHO_SCOPES: string;
  ZOHO_REDIRECT_URI_PATH: string;
  APP_AUTH_USER: string;
  APP_AUTH_TOKEN: string;
  ZOHO_SERVICE_PROVIDER: string;
  LOCAL_DOMAIN: string;
  IS_LOCAL_HOST: boolean;
}

const constants: IConstants = {
  APP_URL: APP_URL,
  API_BASE_URL: API_BASE_URL,
  ZOHO_CLIENT_ID: ZOHO_CLIENT_ID,
  ZOHO_SCOPES: ZOHO_SCOPES,
  ZOHO_REDIRECT_URI_PATH: `${APP_URL}${ZOHO_REDIRECT_URI_PATH}`,
  APP_AUTH_USER: "APP_AUTH_USER",
  APP_AUTH_TOKEN: "APP_AUTH_TOKEN",
  ZOHO_SERVICE_PROVIDER: "ZOHO_SERVICE_PROVIDER",
  LOCAL_DOMAIN: LOCAL_DOMAIN,
  IS_LOCAL_HOST: IS_LOCAL_HOST,
};

export default constants;
