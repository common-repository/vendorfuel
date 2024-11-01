import React from '@wordpress/element';
import { Toasts } from '../../../resources/js/Shared/Toasts';
import { withAuth } from '../components/withAuth';
import { AccountingDetails } from '../features/accounting/AccountingDetails';

const Page = () => {
	return (
		<>
			<h2>Accounting</h2>
			<AccountingDetails />
			<Toasts />
		</>
	);
};

export const AccountingPage = withAuth(Page);
