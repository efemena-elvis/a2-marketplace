////////////////////////////////////////////
////// IMPORTED INVOICE /////////////////
////////////////////////////////////////////

interface InvoiceAddress {
  address: string;
  street2: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
  phone: string;
  fax: string;
  attention: string;
}

interface InvoiceCustomField {
  [key: string]: any;
}

export interface ImportedInvoice {
  ach_payment_initiated: boolean;
  invoice_id: string;
  zcrm_potential_id: string;
  customer_id: string;
  zcrm_potential_name: string;
  customer_name: string;
  company_name: string;
  status: string;
  invoice_number: string;
  reference_number: string;
  date: string;
  due_date: string;
  due_days: string;
  email: string;
  project_name: string;
  billing_address: InvoiceAddress;
  shipping_address: InvoiceAddress;
  country: string;
  phone: string;
  created_by: string;
  total: number;
  balance: number;
  payment_expected_date: string;
  custom_fields: InvoiceCustomField[];
  custom_field_hash: Record<string, any>;
  salesperson_name: string;
  shipping_charge: number;
  adjustment: number;
  created_time: string;
  last_modified_time: string;
  updated_time: string;
  is_viewed_by_client: boolean;
  has_attachment: boolean;
  client_viewed_time: string;
  is_emailed: boolean;
  color_code: string;
  current_sub_status_id: string;
  current_sub_status: string;
  currency_id: string;
  schedule_time: string;
  currency_code: string;
  currency_symbol: string;
  template_type: string;
  no_of_copies: number;
  show_no_of_copies: boolean;
  transaction_type: string;
  reminders_sent: number;
  last_reminder_sent_date: string;
  last_payment_date: string;
  template_id: string;
  documents: string;
  salesperson_id: string;
  write_off_amount: number;
  exchange_rate: number;
  unprocessed_payment_amount: number;
}

////////////////////////////////////////////
////// TRANSFORMED INVOICE /////////////////
////////////////////////////////////////////

export interface PostalAddress {
  street_name: string;
  city_name: string;
  postal_zone: string;
  country: string;
}

export interface Party {
  party_name: string;
  tin: string;
  email: string;
  telephone: string;
  postal_address: PostalAddress;
}

export interface TaxCategory {
  id: string;
  percent: number;
}

export interface TaxSubtotal {
  taxable_amount: number;
  tax_amount: number;
  tax_category: TaxCategory;
}

export interface TaxTotal {
  tax_amount: number;
  tax_subtotal: TaxSubtotal[];
}

export interface LegalMonetaryTotal {
  line_extension_amount: number;
  tax_exclusive_amount: number;
  tax_inclusive_amount: number;
  payable_amount: number;
}

export interface InvoiceItem {
  name: string;
  description: string;
  sellers_item_identification: string;
}

export interface InvoicePrice {
  price_amount: number;
  base_quantity: number;
  price_unit: string;
}

export interface InvoiceLine {
  hsn_code: string;
  product_category: string;
  discount_rate: number;
  discount_amount: number;
  fee_rate: number;
  fee_amount: number;
  invoiced_quantity: number;
  line_extension_amount: number;
  item: InvoiceItem;
  price: InvoicePrice;
}

export interface TransformedInvoice {
  business_id: string;
  irn: string;
  issue_date: string;
  due_date: string;
  issue_time: string;
  invoice_type_code: string;
  payment_status: string;
  note: string;
  tax_point_date: string;
  document_currency_code: string;
  tax_currency_code: string;
  buyer_reference: string;
  accounting_supplier_party: Party;
  accounting_customer_party: Party;
  payment_terms_note: string;
  tax_total: TaxTotal[];
  legal_monetary_total: LegalMonetaryTotal;
  invoice_line: InvoiceLine[];
}
