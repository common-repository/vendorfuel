import { composeNotification } from './composeNotification';

test('Returns the correct email messages', () => {
	expect(composeNotification('email_Approver')).toBe(
		'Pending order email sent to approver'
	);

	expect(composeNotification('email_Customer')).toBe(
		'Email sent to customer'
	);

	expect(composeNotification('email_ShipNotice')).toBe(
		'Shipment email sent to customer'
	);

	expect(composeNotification('email_Admin')).toBe(
		'Notification email sent to admin'
	);
});

test('Returns the correct estore messages', () => {
	expect(composeNotification('estore_SalesOrder')).toBe('Order summitted');
});

test('Returns the correct quickbooks messages', () => {
	expect(composeNotification('quickbooks_ExportBill')).toBe(
		'Invoices for purchase orders exported to QuickBooks as vendor bills'
	);
	expect(composeNotification('quickbooks_ExportInvoice')).toBe(
		'Order receipts exported to QuickBooks as customer invoices'
	);
	expect(composeNotification('quickbooks_GetAccountSubType')).toBe(
		'Failed to retrieve a required QuickBooks account necessary for connection'
	);
	expect(composeNotification('quickbooks_CreateCustomer')).toBe(
		'Failed to get QuickBooks customer for invoice'
	);
	expect(composeNotification('quickbooks_CreateItem')).toBe(
		'Failed to get QuickBooks item for invoice'
	);
	expect(composeNotification('quickbooks_createPaymentMethod')).toBe(
		'Failed to get payment method for invoice'
	);
	expect(composeNotification('quickbooks_createShippingItem')).toBe(
		'Failed to get shipping line item for invoice'
	);
	expect(composeNotification('quickbooks_getTaxItem')).toBe(
		'Failed to get tax line item for invoice'
	);
	expect(composeNotification('quickbooks_CreateVendor')).toBe(
		'Failed to get vendor for bill'
	);
});

test('Returns the type as a message if no match', () => {
	const type = 'Some other type';
	expect(composeNotification(type)).toBe(type);
});
