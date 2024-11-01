import type { Localized } from '../types';
declare const localized: Localized;

const v1 = localized.apiURL;
const v2 = v1.replace('v1', 'v2');

/**
 * V2 should be used in most cases. Avoid switching between different
 */

export const apiURL = {
	CATEGORIES: `${v2}/admin/categories`,
	COLLECTIONS: `${v2}/admin/products/collections`,
	COSTSHEETS: `${v2}/admin/purchasing/costsheets`,
	CUSTOMERS: `${v2}/admin/customers`,
	GROUPS: `${v2}/admin/customers/groups`,
	PRICESHEETS: `${v2}/admin/pricesheets`,
	PRODUCTS: `${v2}/admin/products`,
	ROLES: `${v2}/admin/customers/roles`,
	VENDORS: `${v2}/admin/purchasing/vendors`,
	USERS: `${v2}/admin/users`,
};
