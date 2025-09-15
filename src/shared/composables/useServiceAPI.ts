// ======================================================
// ALL APPLICATION METHODS RELATED TO API HANDLING
// ======================================================
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { useStorage } from "@/shared/composables/useStorage";
import { useString } from "@/shared/composables/useString";
import constants from "@/utilities/constants";

const { getStorage } = useStorage();
const { urlHash, decodeString, logOutUser } = useString();

// Extend AxiosRequestConfig to include the _retry property
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

interface IBusinessProfile {
  businessAddress: string;
  bankAccountNumber: string;
  bankName: string;
  disputeEmailAddress: string;
  generalEmailAddress: string;
  businessId: string;
  businessLogo: string;
  businessMode: string;
  businessName: string;
  businessSector: string;
  activated: string;
  supportEmailAddress: string;
}

interface IAPIKeys {
  playground: any;
  alcatraz?: any;
}

// ===============================
// SERVICE API CLASS
class ServiceApi {
  API_BASE_URL: string = constants.REDSTONE_API_URL;
  API_VERSION: string = constants.REDSTONE_API_VERSION;
  private initialBaseURL: string = `${this.API_BASE_URL}/${this.API_VERSION}/`;
  private customBaseURL: string | null = null;

  // Mapping of names to base URLs
  private baseApiUrls: { [key: string]: string } = {
    storefront: constants.STOREFRONT_API_URL,
  };

  // INSTANTIATE BASE API URL
  constructor() {
    axios.defaults.baseURL = this.initialBaseURL;
    this.injectTokenInterceptor();
  }

  // ===============================
  // SET BASE API URL DYNAMICALLY
  setBaseAPI(name: string): this {
    const baseUrl = this.baseApiUrls[name];

    if (baseUrl) {
      this.customBaseURL = baseUrl;
    } else {
      console.warn(`Base URL for '${name}' not found. Using default base URL.`);
    }
    return this;
  }

  // ===============================
  // GET API REQUEST
  async fetch<T>(
    url: string,
    option: {
      resolve?: boolean;
      payload?: any;
      is_attach?: boolean;
      customHeaders?: Record<string, string | null>;
      requiresPublicKey?: boolean;
    } = {
      resolve: true,
      payload: null,
      is_attach: false,
      customHeaders: {},
      requiresPublicKey: false,
    }
  ): Promise<T | AxiosResponse<T>> {
    const hashed_url = urlHash(url);

    try {
      if (this.customBaseURL) {
        axios.defaults.baseURL = this.customBaseURL;
      }

      const response = await axios.get<T>(
        hashed_url,
        this.getHeaders(
          option.is_attach,
          option.requiresPublicKey,
          option.customHeaders || {}
        )
      );

      // Reset to initial base URL after the request
      axios.defaults.baseURL = this.initialBaseURL;
      this.customBaseURL = null;

      return option.resolve ? response.data : response;
    } catch (err) {
      // Reset to initial base URL in case of error
      axios.defaults.baseURL = this.initialBaseURL;
      this.customBaseURL = null;
      return this.handleErrors(err);
    }
  }

  // ========================================
  // GET API REQUEST FROM A CUSTOM BASE_URL
  async fetchRaw<T>(url: string): Promise<T | AxiosResponse<T>> {
    try {
      const response = await axios.get<T>(url);
      return response?.data;
    } catch (err) {
      return this.handleErrors(err);
    }
  }

  // ===============================
  // POST API REQUEST
  async push<T>(
    url: string,
    {
      payload = {},
      resolve = true,
      is_attach = false,
      requiresPublicKey = false,
      customHeaders = {},
    }: {
      payload?: any;
      resolve?: boolean;
      is_attach?: boolean;
      requiresPublicKey?: boolean;
      customHeaders?: Record<string, string | null>;
    }
  ): Promise<T | AxiosResponse<T>> {
    try {
      if (this.customBaseURL) {
        axios.defaults.baseURL = this.customBaseURL;
      }

      const response = await axios.post<T>(
        url,
        payload,
        this.getHeaders(is_attach, requiresPublicKey, customHeaders)
      );

      // Reset to initial base URL after the request
      axios.defaults.baseURL = this.initialBaseURL;
      this.customBaseURL = null;

      return resolve ? response.data : response;
    } catch (err) {
      // Reset to initial base URL in case of error
      axios.defaults.baseURL = this.initialBaseURL;
      this.customBaseURL = null;
      return this.handleErrors(err);
    }
  }

  // ===============================
  // UPDATE API REQUEST
  async update<T>(
    url: string,
    {
      payload = {},
      resolve = true,
      is_attach = false,
      requiresPublicKey = false,
      customHeaders = {},
    }: {
      payload?: any;
      resolve?: boolean;
      is_attach?: boolean;
      requiresPublicKey?: boolean;
      customHeaders?: Record<string, string | null>;
    }
  ): Promise<T | AxiosResponse<T>> {
    try {
      if (this.customBaseURL) {
        axios.defaults.baseURL = this.customBaseURL;
      }

      const response = await axios.put<T>(
        url,
        payload,
        this.getHeaders(is_attach, requiresPublicKey, customHeaders)
      );

      // Reset to initial base URL after the request
      axios.defaults.baseURL = this.initialBaseURL;
      this.customBaseURL = null;

      return resolve ? response.data : response;
    } catch (err) {
      // Reset to initial base URL in case of error
      axios.defaults.baseURL = this.initialBaseURL;
      this.customBaseURL = null;
      return this.handleErrors(err);
    }
  }

  // ===============================
  // PATCH API REQUEST
  async patch<T>(
    url: string,
    {
      payload = {},
      resolve = true,
      is_attach = false,
      requiresPublicKey = false,
      customHeaders = {},
    }: {
      payload?: any;
      resolve?: boolean;
      is_attach?: boolean;
      requiresPublicKey?: boolean;
      customHeaders?: Record<string, string | null>;
    }
  ): Promise<T | AxiosResponse<T>> {
    try {
      if (this.customBaseURL) {
        axios.defaults.baseURL = this.customBaseURL;
      }

      const response = await axios.patch<T>(
        url,
        payload,
        this.getHeaders(is_attach, requiresPublicKey, customHeaders)
      );

      // Reset to initial base URL after the request
      axios.defaults.baseURL = this.initialBaseURL;
      this.customBaseURL = null;

      return resolve ? response.data : response;
    } catch (err) {
      // Reset to initial base URL in case of error
      axios.defaults.baseURL = this.initialBaseURL;
      this.customBaseURL = null;
      return this.handleErrors(err);
    }
  }

  // ===============================
  // DELETE API REQUEST
  async remove<T>(
    url: string,
    option: {
      payload?: any;
      resolve?: boolean;
      requiresPublicKey?: boolean;
      customHeaders?: Record<string, string | null>;
    } = {
      payload: {},
      resolve: true,
      requiresPublicKey: false,
    }
  ): Promise<T | AxiosResponse<T>> {
    try {
      if (this.customBaseURL) {
        axios.defaults.baseURL = this.customBaseURL;
      }

      const response = await axios.delete<T>(url, {
        data: option.payload,
        ...this.getHeaders(
          false,
          option.requiresPublicKey,
          option.customHeaders || {}
        ),
      });

      // Reset to initial base URL after the request
      axios.defaults.baseURL = this.initialBaseURL;
      this.customBaseURL = null;

      return option.resolve ? response.data : response;
    } catch (err) {
      // Reset to initial base URL in case of error
      axios.defaults.baseURL = this.initialBaseURL;
      this.customBaseURL = null;
      return this.handleErrors(err);
    }
  }

  // ===============================
  // HANDLE API REQUEST ERRORS
  async handleErrors(err: any): Promise<any> {
    return await err.response?.data;
  }

  getUserAPIKeys() {
    const authBusiness = getStorage({
      storage_name: constants.REDSTONE_AUTH_BUSINESS,
      storage_type: "object",
    }) as IBusinessProfile;

    const authBusinessToken = getStorage({
      storage_name: constants.REDSTONE_AUTH_BUSINESS_TOKEN,
      storage_type: "object",
    }) as IAPIKeys;

    if (Object.keys(authBusinessToken).length) {
      if (authBusiness?.businessMode === "test") {
        return {
          publicKey: decodeString(authBusinessToken.playground.nigeria),
          secretKey: decodeString(authBusinessToken.playground.unitedKingdom),
        };
      } else {
        return {
          publicKey: decodeString(authBusinessToken.alcatraz.nigeria),
          secretKey: decodeString(authBusinessToken.alcatraz.unitedKingdom),
        };
      }
    } else {
      return {
        publicKey: null,
        secretKey: null,
      };
    }
  }

  // ===============================
  // SETUP REQUEST HEADERS
  getHeaders(
    attach: boolean = false,
    requiresPublicKey: boolean = false,
    customHeaders: Record<string, string | null>
  ): AxiosRequestConfig {
    const authUserToken = getStorage({
      storage_name: constants.REDSTONE_AUTH_TOKEN,
    }) as string | null;

    if (requiresPublicKey) {
      return this.getPublicKeyHeaderSetup(authUserToken, attach);
    }

    return attach
      ? {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authUserToken}`,
          },
        }
      : {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authUserToken}`,
          },
        };
  }

  getPublicKeyHeaderSetup(userToken: string | null, hasAttachment: boolean) {
    if (hasAttachment) {
      return {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userToken}`,
          "public-key": this.getUserAPIKeys().publicKey,
        },
      };
    }

    return {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
        "public-key": this.getUserAPIKeys().publicKey,
        "secret-key": this.getUserAPIKeys().secretKey,
      },
    };
  }

  // ===============================
  // REQUEST AXIOS INTERCEPTOR
  async injectTokenInterceptor() {
    axios.interceptors.request.use((config: any) => config);

    axios.interceptors.response.use(
      async (response: AxiosResponse) => response,

      // ERROR RESPONSE
      async (error: AxiosError) => {
        const originalConfig = error.config as CustomAxiosRequestConfig;

        if (originalConfig && error.response) {
          if (error.response.status === 401 && !originalConfig._retry) {
            originalConfig._retry = true;
            logOutUser();
            return axios(originalConfig);
          }
        }

        return Promise.reject(error);
      }
    );
  }
}

export default new ServiceApi();
