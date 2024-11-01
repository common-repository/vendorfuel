import { Flex } from '@wordpress/components';
import React from 'react';
import PropTypes from 'prop-types';
import { IndexControl } from '../IndexControl';
import { Button, Stack } from '@mui/material';
import { Layout } from '../../../../resources/js/Shared/Layout';

export const BatchUploadIndex = (props) => {
	const action = {
		label: 'Add new',
		href: props.linkToNew,
	};

	const headers = [
		{ label: 'ID', value: 'id', isId: true },
		{
			label: 'Filename',
			value: 'filename',
			isPrimary: true,
			disabled: true,
		},
		{ label: 'Uploaded', value: 'uploaded_at', isDate: true },
		{ label: 'Started', value: 'started_at', isDate: true },
		{ label: 'Completed', value: 'finished_at', isDate: true },
		{ label: 'Status', value: 'status', isBadge: true },
		{
			label: 'Total',
			value: 'total_records',
			title: 'Total records',
			isNumber: true,
		},
		{
			label: 'Processed',
			value: 'processed_records',
			title: 'Processed records',
			isNumber: true,
		},
	];

	const filters = [
		{
			label: 'Status',
			field: 'status',
			options: [
				{ label: 'All', value: '' },
				{ label: 'Uploaded', value: 'uploaded' },
				{ label: 'Processing', value: 'processing' },
				{ label: 'Failures', value: 'failures' },
				{ label: 'Completed', value: 'completed' },
			],
		},
	];

	return (
		<>
			<Layout heading="Uploads" action={action}>
				<IndexControl
					headers={headers}
					url={props.url}
					orderBy="uploaded_at"
					direction="desc"
					model="batches"
					filters={filters}
				/>
			</Layout>
		</>
	);
};

BatchUploadIndex.propTypes = {
	linkToNew: PropTypes.string.isRequired,
	url: PropTypes.string.isRequired,
};
