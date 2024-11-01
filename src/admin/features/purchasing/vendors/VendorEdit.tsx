import React, { useEffect, useState } from 'react';
import { Flex } from '@wordpress/components';

import { isAnId } from '../../../utils/isAnId';
import { VendorForm } from './VendorForm';
import { Breadcrumb } from '../../../../../resources/js/Shared/Breadcrumb';

export const VendorEdit = () => {
	const [id, setId] = useState<number>();
	const [isNew, setNew] = useState<boolean>();
	const [breadcrumbs, setBreadcrumbs] = useState([
		{ label: 'Purchasing', href: '?page=vf-admin#/purchasing' },
		{ label: 'Vendors', href: '?page=vendorfuel#!/purchasing/vendors' },
	]);

	useEffect(() => {
		const fragment = location.hash.split('/').pop();
		if (isAnId(fragment)) {
			setId(Number(fragment));
		} else {
			setNew(true);
		}
	}, []);

	return (
		<>
			<Breadcrumb breadcrumbs={breadcrumbs} />
			<Flex justify="start">
				<h2>{isNew ? 'Add' : 'Edit'} vendor</h2>
			</Flex>
			<VendorForm setBreadcrumbs={setBreadcrumbs} isNew={isNew} id={id} />
		</>
	);
};
