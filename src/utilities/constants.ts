const APP_URL = process.env.VUE_APP_APP_URL;
const API_BASE_URL = process.env.VUE_APP_API_BASE_URL;
const ZOHO_CLIENT_ID = process.env.VUE_APP_ZOHO_CLIENT_ID;
const ZOHO_REDIRECT_URI = process.env.VUE_APP_ZOHO_REDIRECT_URI;

const LOCAL_DOMAIN = "http://localhost:8065";
const IS_LOCAL_HOST = window.location.hostname === "localhost" ? true : false;

export interface IConstants {
  API_BASE_URL: string;
  ZOHO_CLIENT_ID: string;
  ZOHO_REDIRECT_URI: string;
  APP_AUTH_USER: string;
  APP_AUTH_TOKEN: string;
}

const constants: IConstants = {
  API_BASE_URL: API_BASE_URL,
  ZOHO_CLIENT_ID: ZOHO_CLIENT_ID,
  ZOHO_REDIRECT_URI: ZOHO_REDIRECT_URI,
  APP_AUTH_USER: "APP_AUTH_USER",
  APP_AUTH_TOKEN: "APP_AUTH_TOKEN",
};

export default constants;
