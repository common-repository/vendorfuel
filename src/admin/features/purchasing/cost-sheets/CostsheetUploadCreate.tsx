import type { Localized, SelectControlOption } from '../../../types';
import React, { useState, useEffect } from 'react';
import { SelectControl } from '@wordpress/components';
import { vfAPI } from '../../../lib/vfAPI';
import { BatchUploader } from '../../../components/BatchUploads/BatchUploader';
import breadcrumbBase from './breadcrumbs.json';
import { apiURL } from '../../../data/apiURL';
import { Breadcrumb } from '../../../../../resources/js/Shared/Breadcrumb';

declare const localized: Localized;

export const CostSheetUploadCreate = () => {
	const breadcrumbs = [
		...breadcrumbBase,
		{
			label: 'Uploads',
			href: '?page=vf-admin#/purchasing/cost-sheets/uploads',
		},
		{
			label: 'Add new upload',
			href: `?page=vf-admin#/purchasing/cost-sheets/uploads/create`,
		},
	];
	const nextApiURL: string = localized.apiURL.replace('v1', 'v2');
	const templateURL = `${localized.dir.url}assets/downloads/cost-sheet-upload-template.xlsx`;

	const [isBusy, setBusy] = useState<boolean>(false);
	const [isDisabled, setDisabled] = useState<boolean>(false);
	const [costSheets, setCostSheets] = useState<SelectControlOption[]>([
		{ value: '', label: 'Select a cost sheet', disabled: true },
	]);
	const [costSheet, setCostSheet] = useState('');

	const convertToOptions = (
		data: Array<{ name: string; id: number }>
	): Array<{ label: string; value: string }> => {
		return data.map((item) => {
			return {
				label: item.name,
				value: item.id.toString(),
			};
		});
	};

	const handleUpload = (file: File) => {
		storeCustomerUpload(file);
	};

	const storeCustomerUpload = (file: File) => {
		setBusy(true);
		const url = `${apiURL.COSTSHEETS}/batches`;
		const config = {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		};
		const data = new FormData();
		data.append('file', file);
		data.append('cost_sheet_id', costSheet);
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

	useEffect(() => {
		const url = apiURL.COSTSHEETS;
		vfAPI.get(url).then((response) => {
			const options = convertToOptions(response.data.cost_sheets.data);
			options.unshift(...costSheets);
			setCostSheets(options);
		});
	}, []);

	return (
		<>
			<Breadcrumb breadcrumbs={breadcrumbs} />
			<h2>Upload cost sheet</h2>
			<SelectControl
				label="Select which cost sheet to update"
				value={costSheet}
				options={costSheets}
				onChange={setCostSheet}
			/>
			{costSheet && (
				<BatchUploader
					isBusy={isBusy}
					isDisabled={isDisabled}
					handleUpload={handleUpload}
					templateURL={templateURL}
				/>
			)}
		</>
	);
};
