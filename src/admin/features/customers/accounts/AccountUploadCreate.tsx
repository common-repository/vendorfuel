import React, { useState } from 'react';
import { vfAPI } from '../../../lib/vfAPI';
import { BatchUploader } from '../../../components/BatchUploads/BatchUploader';
import type { Localized } from '../../../types';
import { Breadcrumb } from '../../../../../resources/js/Shared/Breadcrumb';

declare const localized: Localized;

export const AccountUploadCreate = () => {
	const breadcrumbs = [
		{ label: 'Customers', href: '?page=vf-admin#/customers' },
		{ label: 'Accounts', href: '?page=vf-admin#/customers/accounts' },
		{
			label: 'Uploads',
			href: '?page=vf-admin#/customers/accounts/uploads',
		},
		{
			label: 'Add new',
			href: `?page=vf-admin#/customers/accounts/uploads/create`,
		},
	];
	const nextApiURL: string = localized.apiURL.replace('v1', 'v2');
	const templateHeaders: Array<string> = [
		'id',
		'address_id',
		'price_sheet_id',
		'group_id',
		'name',
		'email',
		'password',
		'organization',
		'allow_payment',
		'credit_line',
		'group_admin',
		'group_approver',
		'group_pending_emails',
		'group_requestor',
		'address_name',
		'address_first_name',
		'address_last_name',
		'address_email',
		'address_address1',
		'address_address2',
		'address_city',
		'address_state',
		'address_zip',
		'address_phone',
		'address_phone_extension',
		'address_type',
		'f1_replace_field',
		'f1_name',
		'f1_value',
		'f2_replace_field',
		'f2_name',
		'f2_value',
		'f3_name',
		'f3_value',
		'lock_billing',
		'lock_shipping',
		'order_prefix',
		'promo_engine',
		'item_limit',
		'limit',
		'limit_type',
		'punchout_only',
		'punchout_suppliers',
		'taxable',
		'terms',
	];
	const templateURL = `${localized.dir.url}assets/downloads/customer-upload-template.xlsx`;

	const [isBusy, setBusy] = useState<boolean>(false);
	const [isDisabled, setDisabled] = useState<boolean>(false);

	const handleUpload = (file: File) => {
		storeCustomerUpload(file);
	};

	const storeCustomerUpload = (file: File) => {
		setBusy(true);
		const url = `${nextApiURL}/admin/customers/batches`;
		const config = {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		};
		const data = new FormData();
		data.append('file', file);
		vfAPI.post(url, data, config).then((response) => {
			setBusy(false);
			if (response.data?.batch?.id) {
				location.assign(
					location.href.replace(
						'create',
						response.data.batch.id.toString()
					)
				);
			}
		});
	};

	return (
		<>
			<Breadcrumb breadcrumbs={breadcrumbs} />
			<h2>Add upload</h2>
			<BatchUploader
				isBusy={isBusy}
				isDisabled={isDisabled}
				handleUpload={handleUpload}
				templateURL={templateURL}
			/>
		</>
	);
};
