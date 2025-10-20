const version: string = "v1";
const accountNameSpace: string = `account/${version}`;

export const settingsRoutes = {
  getApiKeys: `${accountNameSpace}/apikeys`,
  createApiKey: `${accountNameSpace}/apikeys`,
};
