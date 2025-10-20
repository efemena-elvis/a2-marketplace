const version: string = "v1";
const authNameSpace: string = `auth/${version}`;
const boardingNameSpace: string = `boarding/${version}`;
const invoiceNameSpace: string = `invoices/${version}`;

export const authRoutes = {
  login: `${authNameSpace}/login`,
  logout: `${authNameSpace}/logout`,
  signup: `${boardingNameSpace}/accounts`,
  verifyAccount: `${boardingNameSpace}/accounts/verifications`,
  providerConnect: `${invoiceNameSpace}/imports/zoho/auth`,
};
