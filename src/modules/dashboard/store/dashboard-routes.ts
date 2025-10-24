const version: string = "v1";
const invoiceNameSpace: string = `invoices/${version}`;

export const dashboardRoutes = {
  getInvoices: `${invoiceNameSpace}/imports/zoho/invoices`,
  transformInvoice: `${invoiceNameSpace}/imports/zoho/invoices/:invoice_id`,
};
