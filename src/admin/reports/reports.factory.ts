export function reportsFactory() {
	const storeTables = {
		admin_users: [
			{
				name: 'ID',
				value: 'admin_users.id',
				table: 'admin_users',
			},
			{ name: 'Name', value: 'admin_users.name', table: 'admin_users' },
			{ name: 'Email', value: 'admin_users.email', table: 'admin_users' },
			{
				name: 'Last login',
				value: 'admin_users.last_login_at',
				table: 'admin_users',
			},
			{
				name: 'Created',
				value: 'admin_users.created_at',
				table: 'admin_users',
			},
		],
		banner_areas: [
			{
				name: 'ID',
				value: 'banner_areas.area_id',
				table: 'banner_areas',
			},
			{ name: 'Name', value: 'banner_areas.name', table: 'banner_areas' },
			{
				name: 'Description',
				value: 'banner_areas.description',
				table: 'banner_areas',
			},
		],
		categories: [
			{
				name: 'ID',
				value: 'cat_id',
				table: 'categories',
			},
			{ name: 'Name', value: 'title', table: 'categories' },
			{ name: 'Slug', value: 'slug', table: 'categories' },
			{
				name: 'Description',
				value: 'description',
				table: 'categories',
			},
			{
				name: 'Image URL',
				value: 'img_url',
				table: 'categories',
			},
			{
				name: 'Parent ID',
				value: 'parent_id',
				table: 'categories',
			},
			{ name: 'UNSPSC', value: 'unspsc', table: 'categories' },
			{
				name: 'Tax code',
				value: 'avatax_tax_code',
				table: 'categories',
			},
		],
		collections: [
			{
				name: 'ID',
				value: 'id',
				table: 'collections',
			},
			{ name: 'Name', value: 'name', table: 'collections' },
			{ name: 'Description', value: 'description', table: 'collections' },
			{
				name: 'Image URL',
				value: 'img_url',
				table: 'collections',
			},
		],
		customers: [
			{ name: 'ID', value: 'customers.id', table: 'customers' },
			{ name: 'Status', value: 'customers.status', table: 'customers' },
			{ name: 'Name', value: 'customers.name', table: 'customers' },
			{ name: 'Email', value: 'customers.email', table: 'customers' },
			{
				name: 'Company/Organization',
				value: 'customers.organization',
				table: 'customers',
			},
			{
				name: 'Price sheet ID',
				value: 'customers.price_sheet_id',
				table: 'customers',
			},
			{ name: 'Terms', value: 'customers.terms', table: 'customers' },
			{
				name: 'Customer prefix',
				value: 'customers.customer_prefix',
				table: 'customers',
			},
			{
				name: 'Order prefix',
				value: 'customers.order_prefix',
				table: 'customers',
			},
			{
				name: 'Limit type',
				value: 'customers.limit_type',
				table: 'customers',
			},
			{ name: 'Limit', value: 'customers.limit', table: 'customers' },
			{ name: 'Group ', value: 'customers.group_id', table: 'customers' },
			{
				name: 'Credit line',
				value: 'customers.credit_line',
				table: 'customers',
			},
			{ name: 'Taxable', value: 'customers.taxable', table: 'customers' },
			{
				name: 'Punchout only',
				value: 'customers.punchout_only',
				table: 'customers',
			},
			{
				name: 'Lock billing',
				value: 'customers.lock_billing',
				table: 'customers',
			},
			{
				name: 'Lock shipping',
				value: 'customers.lock_shipping',
				table: 'customers',
			},
			{
				name: 'Change password',
				value: 'customers.change_pw',
				table: 'customers',
			},
		],
		customer_groups: [
			{
				name: 'ID',
				value: 'customer_groups.group_id',
				table: 'customer_groups',
			},
			{
				name: 'Name',
				value: 'customer_groups.name',
				table: 'customer_groups',
			},
			{
				name: 'Parent group ID',
				value: 'customer_groups.parent_group_id',
				table: 'customer_groups',
			},
			{
				name: 'Default price sheet',
				value: 'customer_groups.default_price_sheet',
				table: 'customer_groups',
			},
			{
				name: 'Group invite code',
				value: 'customer_groups.group_invite_code',
				table: 'customer_groups',
			},
			{
				name: 'Authorized emails',
				value: 'customer_groups.authorized_emails',
				table: 'customer_groups',
			},
			{
				name: 'Group registration available',
				value: 'customer_groups.group_registration_available',
				table: 'customer_groups',
			},
			{
				name: 'Order prefix',
				value: 'customer_groups.order_prefix',
				table: 'customer_groups',
			},
			{
				name: 'Terms',
				value: 'customer_groups.terms',
				table: 'customer_groups',
			},
			{
				name: 'Shipping mode',
				value: 'customer_groups.shipping_mode',
				table: 'customer_groups',
			},
		],
		email_templates: [
			{
				name: 'ID',
				value: 'email_templates.id',
				table: 'email_templates',
			},
			{
				name: 'Type',
				value: 'email_templates.type',
				table: 'email_templates',
			},
			{
				name: 'Sender name',
				value: 'email_templates.sender_name',
				table: 'email_templates',
			},
			{
				name: 'Sender email',
				value: 'email_templates.sender_email',
				table: 'email_templates',
			},
			{
				name: 'Subject',
				value: 'email_templates.subject',
				table: 'email_templates',
			},
			{
				name: 'Message',
				value: 'email_templates.message',
				table: 'email_templates',
			},
			{
				name: 'Notification emails',
				value: 'email_templates.notification_emails',
				table: 'email_templates',
			},
		],
		manufacturers: [
			{
				name: 'ID',
				value: 'manufacturers.id',
				table: 'manufacturers',
			},
			{
				name: 'Name',
				value: 'manufacturers.name',
				table: 'manufacturers',
			},
			{
				name: 'Info',
				value: 'manufacturers.info',
				table: 'manufacturers',
			},
			{
				name: 'Website',
				value: 'manufacturers.website',
				table: 'manufacturers',
			},
		],
		parcels: [
			{ name: 'ID', value: 'parcels.id', table: 'parcels' },
			{ name: 'Name', value: 'parcels.title', table: 'parcels' },
			{ name: 'Length', value: 'parcels.length', table: 'parcels' },
			{ name: 'Width', value: 'parcels.width', table: 'parcels' },
			{ name: 'Height', value: 'parcels.height', table: 'parcels' },
			{ name: 'Units', value: 'parcels.distance_unit', table: 'parcels' },
		],
		price_sheets_index: [
			{
				name: 'ID',
				value: 'price_sheets_index.price_sheet_id',
				table: 'price_sheets_index',
			},
			{
				name: 'Name',
				value: 'price_sheets_index.sheet',
				table: 'price_sheets_index',
			},
			{
				name: 'Site ID',
				value: 'price_sheets_index.site_id',
				table: 'price_sheets_index',
			},
			{
				name: 'GP Price Sheet',
				value: 'price_sheets_index.gp_price_sheet',
				table: 'price_sheets_index',
			},
		],
		products: [
			{
				name: 'ID',
				value: 'products.product_id',
				table: 'products',
			},
			{
				name: 'Name (Description)',
				value: 'products.description',
				table: 'products',
			},
			{ name: 'Status', value: 'products.status', table: 'products' },
			{ name: 'SKU', value: 'products.sku', table: 'products' },
			{
				name: 'Long description',
				value: 'products.long_description',
				table: 'products',
			},
			{ name: 'Slug', value: 'products.slug', table: 'products' },
			{ name: 'Quantity', value: 'products.qty', table: 'products' },
			{ name: 'UoM ID', value: 'products.uomid', table: 'products' },
			{
				name: 'UoM quantity',
				value: 'products.uomqty',
				table: 'products',
			},
			{
				name: 'UoM description',
				value: 'products.uomdesc',
				table: 'products',
			},
			{
				name: 'Category ID',
				value: 'products.category_id',
				table: 'products',
			},
			{
				name: 'Manufacturer ID',
				value: 'products.manufacturer_id',
				table: 'products',
			},
			{
				name: 'Manufacturer Part #',
				value: 'products.mfg_part_num',
				table: 'products',
			},
			{
				name: 'Brand name',
				value: 'products.brand_name',
				table: 'products',
			},
			{ name: 'Includes', value: 'products.includes', table: 'products' },
			{ name: 'Related', value: 'products.related', table: 'products' },
			{
				name: 'Alternates',
				value: 'products.alternates',
				table: 'products',
			},
			{ name: 'UPC', value: 'products.upc', table: 'products' },
			{ name: 'Country', value: 'products.country', table: 'products' },
			{ name: 'Device', value: 'products.device', table: 'products' },
			{ name: 'Family', value: 'products.family', table: 'products' },
			{ name: 'Green', value: 'products.green', table: 'products' },
			{
				name: 'Green attributes',
				value: 'products.green_attributes',
				table: 'products',
			},
			{ name: 'Hazmat', value: 'products.hazmat', table: 'products' },
			{ name: 'Keywords', value: 'products.keywords', table: 'products' },
			{ name: 'Model', value: 'products.model', table: 'products' },
			{ name: 'Rebate', value: 'products.rebate', table: 'products' },
			{
				name: 'Truck only',
				value: 'products.truck_only',
				table: 'products',
			},
			{
				name: 'AbilityOne SKU',
				value: 'products.ability_one_sku',
				table: 'products',
			},
			{
				name: 'Rating',
				value: 'products.average_rating',
				table: 'products',
			},
		],
		orders: [
			{ name: 'ID', value: 'orders.order_id', table: 'orders' },
			{ name: 'Group ID', value: 'orders.group_id', table: 'orders' },
			{
				name: 'Customer ID',
				value: 'orders.customer_id',
				table: 'orders',
			},
			{
				name: 'Approver ID',
				value: 'orders.approver_id',
				table: 'orders',
			},
			{
				name: 'Shipping ID',
				value: 'orders.shipping_id',
				table: 'orders',
			},
			{ name: 'Billing ID', value: 'orders.billing_id', table: 'orders' },
			{
				name: 'Cost center ID',
				value: 'orders.cost_center_id',
				table: 'orders',
			},
			{
				name: 'Shipping rule ID',
				value: 'orders.shipping_rule_id',
				table: 'orders',
			},
			{
				name: 'Cost center code',
				value: 'orders.cost_center_code',
				table: 'orders',
			},
			{
				name: 'Price sheet',
				value: 'orders.price_sheet',
				table: 'orders',
			},
			{ name: 'Loc ID', value: 'orders.loc_id', table: 'orders' },
			{
				name: 'Trx redeemed',
				value: 'orders.trx_redeemed',
				table: 'orders',
			},
			{ name: 'Status', value: 'orders.status', table: 'orders' },
			{
				name: 'Order shipped',
				value: 'orders.order_shipped',
				table: 'orders',
			},
			{
				name: 'Tracking code',
				value: 'orders.tracking_code',
				table: 'orders',
			},
			{
				name: 'Shipping method',
				value: 'orders.shipping_method',
				table: 'orders',
			},
			{
				name: 'Shipping carrier',
				value: 'orders.shipping_carrier',
				table: 'orders',
			},
			{ name: 'Order date', value: 'orders.order_date', table: 'orders' },
			{ name: 'Subtotal', value: 'orders.subtotal', table: 'orders' },
			{ name: 'Tax', value: 'orders.tax', table: 'orders' },
			{ name: 'Tax rate', value: 'orders.tax_rate', table: 'orders' },
			{ name: 'Shipping', value: 'orders.shipping', table: 'orders' },
			{ name: 'Discount', value: 'orders.discount', table: 'orders' },
			{
				name: 'Promo discount',
				value: 'orders.promo_discount',
				table: 'orders',
			},
			{
				name: 'Total amount',
				value: 'orders.total_amt',
				table: 'orders',
			},
			{
				name: 'Purchase order number',
				value: 'orders.rr_po_num',
				table: 'orders',
			},
			{
				name: 'Issuing office',
				value: 'orders.issuing_office',
				table: 'orders',
			},
			{ name: 'Approver', value: 'orders.approver', table: 'orders' },
			{ name: 'Attention', value: 'orders.attention', table: 'orders' },
			{
				name: 'Organization',
				value: 'orders.organization',
				table: 'orders',
			},
			{ name: 'First name', value: 'orders.first_name', table: 'orders' },
			{ name: 'Last name', value: 'orders.last_name', table: 'orders' },
			{ name: 'Email', value: 'orders.email', table: 'orders' },
			{ name: 'Phone', value: 'orders.phone', table: 'orders' },
			{
				name: 'Billing first name',
				value: 'orders.bill_first_name',
				table: 'orders',
			},
			{
				name: 'Billing last name',
				value: 'orders.bill_last_name',
				table: 'orders',
			},
			{
				name: 'Billing email',
				value: 'orders.bill_email',
				table: 'orders',
			},
			{
				name: 'Billing phone',
				value: 'orders.bill_phone',
				table: 'orders',
			},
			{
				name: 'Payment method',
				value: 'orders.payment_method',
				table: 'orders',
			},
			{
				name: 'Credit line',
				value: 'orders.credit_line',
				table: 'orders',
			},
			{
				name: 'Credit card',
				value: 'orders.credit_card',
				table: 'orders',
			},
			{
				name: 'Credit card type',
				value: 'orders.cctype',
				table: 'orders',
			},
			{
				name: 'Shipping profile',
				value: 'orders.shipping_profile',
				table: 'orders',
			},
			{ name: 'Address 1', value: 'orders.address1', table: 'orders' },
			{ name: 'Address 2', value: 'orders.address2', table: 'orders' },
			{ name: 'City', value: 'orders.city', table: 'orders' },
			{ name: 'State', value: 'orders.state', table: 'orders' },
			{ name: 'Zip', value: 'orders.zip', table: 'orders' },
			{
				name: 'Billing address 1',
				value: 'orders.bill_address1',
				table: 'orders',
			},
			{
				name: 'Billing address 2',
				value: 'orders.bill_address2',
				table: 'orders',
			},
			{
				name: 'Billing city',
				value: 'orders.bill_city',
				table: 'orders',
			},
			{
				name: 'Billing state',
				value: 'orders.bill_state',
				table: 'orders',
			},
			{ name: 'Billing zip', value: 'orders.bill_zip', table: 'orders' },
			{ name: 'Notes', value: 'orders.notes', table: 'orders' },
			{ name: 'GSA total', value: 'orders.gsa_total', table: 'orders' },
			{
				name: 'Other total',
				value: 'orders.other_total',
				table: 'orders',
			},
			{
				name: 'Approver notes',
				value: 'orders.approver_notes',
				table: 'orders',
			},
			{
				name: 'Promo codes',
				value: 'orders.promo_codes',
				table: 'orders',
			},
			{
				name: 'F1 replace field',
				value: 'orders.f1_replace_field',
				table: 'orders',
			},
			{ name: 'F1 name', value: 'orders.f1_name', table: 'orders' },
			{ name: 'F1 value', value: 'orders.f1_value', table: 'orders' },
			{
				name: 'F2 replace field',
				value: 'orders.f2_replace_field',
				table: 'orders',
			},
			{ name: 'F2 name', value: 'orders.f2_name', table: 'orders' },
			{ name: 'F2 value', value: 'orders.f2_value', table: 'orders' },
			{ name: 'F3 name', value: 'orders.f3_name', table: 'orders' },
			{ name: 'F3 value', value: 'orders.f3_name', table: 'orders' },
			{ name: 'F4 name', value: 'orders.f4_name', table: 'orders' },
			{ name: 'F4 value', value: 'orders.f4_name', table: 'orders' },
			{ name: 'F5 name', value: 'orders.f5_name', table: 'orders' },
			{ name: 'F5 value', value: 'orders.f5_name', table: 'orders' },
			{ name: 'F6 name', value: 'orders.f6_name', table: 'orders' },
			{ name: 'F6 value', value: 'orders.f6_name', table: 'orders' },
			{
				name: 'Reference ID',
				value: 'orders.reference_id',
				table: 'orders',
			},
			{ name: 'Payload ID', value: 'orders.payload_id', table: 'orders' },
			{
				name: 'Postback URL',
				value: 'orders.postback_url',
				table: 'orders',
			},
			{
				name: 'Shipping token',
				value: 'orders.shipping_token',
				table: 'orders',
			},
		],
	};
	const joinTables = {
		group_admins: [
			{
				name: 'Customer ID',
				value: 'group_admins.customer_id',
				table: 'group_admins',
			},
			{
				name: 'Group ID',
				value: 'group_admins.group_id',
				table: 'group_admins',
			},
		],

		group_approvers: [
			{
				name: 'Customer ID',
				value: 'group_approvers.customer_id',
				table: 'group_approvers',
			},
			{
				name: 'Group ID',
				value: 'group_approvers.group_id',
				table: 'group_approvers',
			},
		],

		inventory_logs: [
			{ name: 'ID', value: 'inventory_logs.id', table: 'inventory_logs' },
			{
				name: 'Product ID',
				value: 'inventory_logs.product_id',
				table: 'inventory_logs',
			},
			{
				name: 'In',
				value: 'inventory_logs.inventory_in',
				table: 'inventory_logs',
			},
			{
				name: 'Out',
				value: 'inventory_logs.inventory_out',
				table: 'inventory_logs',
			},
			{
				name: 'Date',
				value: 'inventory_logs.created_at',
				table: 'inventory_logs',
			},
		],

		pending_items: [
			{
				name: 'ID',
				value: 'pending_items.pend_id',
				table: 'pending_items',
			},
			{
				name: 'Cart items ID',
				value: 'pending_items.cart_item_id',
				table: 'pending_items',
			},
			{
				name: 'Order ID',
				value: 'pending_items.order_id',
				table: 'pending_items',
			},
			{
				name: 'Product ID',
				value: 'pending_items.product_id',
				table: 'pending_items',
			},
			{
				name: 'Quantity',
				value: 'pending_items.qty',
				table: 'pending_items',
			},
			{
				name: 'Price',
				value: 'pending_items.price',
				table: 'pending_items',
			},
		],

		price_sheets: [
			{
				name: 'ID',
				value: 'price_sheets.ps_item_id',
				table: 'price_sheets',
			},
			{
				name: 'Price Sheet ID',
				value: 'price_sheets.price_sheet_id',
				table: 'price_sheets',
			},
			{
				name: 'Product ID',
				value: 'price_sheets.product_id',
				table: 'price_sheets',
			},
			{ name: 'SKU', value: 'price_sheets.sku', table: 'price_sheets' },
			{ name: 'GSA', value: 'price_sheets.gsa', table: 'price_sheets' },
			{
				name: 'AbilityOne',
				value: 'price_sheets.ability_one',
				table: 'price_sheets',
			},
			{
				name: 'Core list',
				value: 'price_sheets.core_list',
				table: 'price_sheets',
			},
			{
				name: 'Price',
				value: 'price_sheets.price',
				table: 'price_sheets',
			},
		],

		product_collection: [
			{
				name: 'Collection ID',
				value: 'product_collection.collection_id',
				table: 'product_collection',
			},
			{
				name: 'Product ID',
				value: 'product_collection.product_id',
				table: 'product_collection',
			},
		],

		purchased_items: [
			{
				name: 'Purchase ID',
				value: 'purchased_items.purch_id',
				table: 'purchased_items',
			},
			{
				name: 'Customer ID',
				value: 'purchased_items.customer_id',
				table: 'purchased_items',
			},
			{
				name: 'Order ID',
				value: 'purchased_items.order_id',
				table: 'purchased_items',
			},
			{
				name: 'Product ID',
				value: 'purchased_items.product_id',
				table: 'purchased_items',
			},
			{
				name: 'Purchase date',
				value: 'purchased_items.purchase_date',
				table: 'purchased_items',
			},
			{
				name: 'Quantity',
				value: 'purchased_items.qty',
				table: 'purchased_items',
			},
			{
				name: 'Price',
				value: 'purchased_items.price',
				table: 'purchased_items',
			},
			{
				name: 'GSA',
				value: 'purchased_items.gsa',
				table: 'purchased_items',
			},
			{
				name: 'AbilityOne',
				value: 'purchased_items.ability_one',
				table: 'purchased_items',
			},
			{
				name: 'Core list',
				value: 'purchased_items.core_list',
				table: 'purchased_items',
			},
			{
				name: 'Return status',
				value: 'purchased_items.return_status',
				table: 'purchased_items',
			},
			{
				name: 'Return request date',
				value: 'purchased_items.return_request_date',
				table: 'purchased_items',
			},
			{
				name: 'Return response notes',
				value: 'purchased_items.return_response_notes',
				table: 'purchased_items',
			},
			{
				name: 'Return reason',
				value: 'purchased_items.return_reason',
				table: 'purchased_items',
			},
			{
				name: 'Return quantity',
				value: 'purchased_items.return_qty',
				table: 'purchased_items',
			},
			{
				name: 'Return contact',
				value: 'purchased_items.return_contact',
				table: 'purchased_items',
			},
			{
				name: 'Return boxes',
				value: 'purchased_items.return_boxes',
				table: 'purchased_items',
			},
		],

		addresses: [
			{ name: 'ID', value: 'addresses.id', table: 'addresses' },
			{
				name: 'Customer ID',
				value: 'addresses.customer_id',
				table: 'addresses',
			},
			{ name: 'Name', value: 'addresses.name', table: 'addresses' },
			{
				name: 'First name',
				value: 'addresses.first_name',
				table: 'addresses',
			},
			{
				name: 'Last name',
				value: 'addresses.last_name',
				table: 'addresses',
			},
			{ name: 'Email', value: 'addresses.email', table: 'addresses' },
			{
				name: 'Address 1',
				value: 'addresses.address1',
				table: 'addresses',
			},
			{
				name: 'Address 2',
				value: 'addresses.address2',
				table: 'addresses',
			},
			{ name: 'City', value: 'addresses.city', table: 'addresses' },
			{ name: 'State', value: 'addresses.state', table: 'addresses' },
			{ name: 'Zip', value: 'addresses.zip', table: 'addresses' },
			{ name: 'Phone', value: 'addresses.phone', table: 'addresses' },
			{ name: 'Active', value: 'addresses.active', table: 'addresses' },
		],
	};

	const allTables = Object.fromEntries(
		Object.entries({
			...storeTables,
			inventory_logs: joinTables.inventory_logs,
			group_admins: joinTables.group_admins,
			group_approvers: joinTables.group_approvers,
			pending_items: joinTables.pending_items,
			price_sheets: joinTables.price_sheets,
			purchased_items: joinTables.purchased_items,
			addresses: joinTables.addresses,
		}).sort()
	);

	const service = {
		getStoreTables() {
			return storeTables;
		},
		getAllTables() {
			return allTables;
		},
		getComparators() {
			return [
				'contains',
				'!contains',
				'=',
				'!=',
				'>',
				'<',
				'begins',
				'!begins',
				'ends',
				'!ends',
			];
		},
	};

	return service;
}
