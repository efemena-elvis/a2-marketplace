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

export interface PreTransformedInvoice {
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

export interface Invoice {
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
  transformed_invoice: PreTransformedInvoice;
}

export interface TransformedInvoice {
  invoice_id: string;
  invoice_number: string;
  date: string;
  due_date: string;
  offline_created_date_with_time?: string;

  customer_id: string;
  customer_name: string;
  customer_custom_fields: any[];
  customer_custom_field_hash: Record<string, any>;
  email: string;

  currency_id: string;
  currency_code: string;
  currency_symbol: string;
  currency_name_formatted: string;

  invoice_source: string;
  status: string;
  unprocessed_payment_amount: number;
  recurring_invoice_id: string;
  is_last_child_invoice: boolean;

  payment_terms: number;
  payment_terms_label: string;
  early_payment_discount_percentage: number;
  early_payment_discount_due_days?: string;
  early_payment_discount_amount: number;
  payment_reminder_enabled: boolean;
  payment_made: number;

  zcrm_potential_id: string;
  zcrm_potential_name: string;
  reference_number: string;

  is_early_payment_discount_applicable: boolean;
  lock_details: {
    can_lock: boolean;
  };
  locked_actions: string[];
  is_progress_invoice: boolean;
  can_show_kit_return: boolean;
  is_kit_partial_return: boolean;

  line_items: LineItem[];

  total_retention_amount: number;
  retention_items: any[];
  retention_override_preference: string;

  exchange_rate: number;
  is_autobill_enabled: boolean;
  inprocess_transaction_present: boolean;
  allow_partial_payments: boolean;

  price_precision: number;
  sub_total: number;
  tax_total: number;
  discount_total: number;
  discount_percent: number;
  discount: number;
  discount_applied_on_amount: number;
  discount_type: string;

  tax_override_preference: string;
  tds_override_preference: string;
  is_discount_before_tax: boolean;

  adjustment: number;
  adjustment_description: string;

  shipping_charge_tax_id: string;
  shipping_charge_tax_name: string;
  shipping_charge_tax_type: string;
  shipping_charge_tax_percentage: string;
  shipping_charge_tax: string;
  shipping_charge_exclusive_of_tax: number;
  shipping_charge_inclusive_of_tax: number;
  shipping_charge_account_id: string;
  shipping_charge_account_name: string;
  shipping_charge: number;

  bcy_sub_total: number;
  bcy_discount_total: number;
  bcy_tax_total: number;
  bcy_total: number;

  total: number;
  balance: number;
  write_off_amount: number;
  roundoff_value: number;

  transaction_rounding_type: string;
  rounding_mode: string;
  bcy_rounding_mode: string;
  is_inclusive_tax: boolean;
  sub_total_inclusive_of_tax: number;

  tax_reg_no: string;
  contact_category: string;
  tax_rounding: string;

  taxes: Tax[];
  shipping_charge_taxes: any[];
  tds_calculation_type: string;

  can_send_invoice_sms: boolean;
  payment_expected_date: string;
  payment_discount: number;
  stop_reminder_until_payment_expected_date: boolean;
  last_payment_date: string;

  ach_supported: boolean;
  ach_payment_initiated: boolean;
  payment_options: {
    payment_gateways: any[];
  };
  reader_offline_payment_initiated: boolean;

  contact_persons: string[];
  contact_persons_associated: ContactPerson[];
}

export interface LineItem {
  line_item_id: string;
  item_id: string;
  item_order: number;
  name: string;
  internal_name: string;
  description: string;
  discount_account_id: string;
  discount_account_name: string;
  unit: string;
  quantity: number;
  discount_amount: number;
  discount: number;
  discounts: any[];
  bcy_rate: number;
  rate: number;
  header_id: string;
  header_name: string;
  pricebook_id: string;
  tax_id: string;
  tax_name: string;
  tax_type: string;
  tax_percentage: number;
  item_total: number;
  item_custom_fields: any[];
  pricing_scheme: string;
  documents: any[];
  image_document_id: string;
  line_item_taxes: LineItemTax[];
  project_id: string;
  time_entry_ids: any[];
  expense_id: string;
  item_type: string;
  expense_receipt_name: string;
  sales_rate: string;
  purchase_rate: string;
  salesorder_item_id: string;
  cost_amount: number;
  markup_percent: number;
  mapped_items: any[];
}

export interface LineItemTax {
  tax_id: string;
  tax_name: string;
  tax_amount: number;
  tax_percentage: number;
  tax_specific_type: string;
}

export interface Tax {
  tax_amount: number;
  tax_name: string;
  tax_amount_formatted: string;
}

export interface ContactPerson {
  contact_person_id: string;
  contact_person_name: string;
  first_name: string;
  last_name: string;
  contact_person_email: string;
}
