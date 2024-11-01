export function composeNotification(type: string): string {
	if (type.startsWith('email_')) {
		let fragment = type.replace('email_', '').toLowerCase();
		switch (fragment) {
			case 'admin':
				return 'Notification email sent to admin';
			case 'approver':
				return 'Pending order email sent to approver';
			case 'customer':
				return 'Email sent to customer';
			case 'shipnotice':
				return 'Shipment email sent to customer';
		}
	} else if (type.toLowerCase() === 'estore_salesorder') {
		return 'Order summitted';
	} else if (type.startsWith('quickbooks_')) {
		let fragment = type.replace('quickbooks_', '').toLowerCase();
		switch (fragment) {
			case 'exportbill':
				return 'Invoices for purchase orders exported to QuickBooks as vendor bills';
			case 'exportinvoice':
				return 'Order receipts exported to QuickBooks as customer invoices';
			case 'getaccountsubtype':
				return 'Failed to retrieve a required QuickBooks account necessary for connection';
			case 'createcustomer':
				return 'Failed to get QuickBooks customer for invoice';
			case 'createitem':
				return 'Failed to get QuickBooks item for invoice';
			case 'createpaymentmethod':
				return 'Failed to get payment method for invoice';
			case 'createshippingitem':
				return 'Failed to get shipping line item for invoice';
			case 'gettaxitem':
				return 'Failed to get tax line item for invoice';
			case 'createvendor':
				return 'Failed to get vendor for bill';
		}
	}
	return type;
}
