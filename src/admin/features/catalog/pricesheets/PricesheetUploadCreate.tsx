import type { Localized, SelectControlOption } from '../../../types';
import React, { useState, useEffect } from 'react';
import { CheckboxControl, Flex, SelectControl } from '@wordpress/components';
import { vfAPI } from '../../../lib/vfAPI';
import { BatchUploader } from '../../../components/BatchUploads/BatchUploader';
import { Breadcrumb } from '../../../../../resources/js/Shared/Breadcrumb';

declare const localized: Localized;

export const PricesheetUploadCreate = () => {
	const breadcrumbs = [
		{ label: 'Catalog', href: '?page=vf-admin#/catalog' },
		{
			label: 'Price sheets',
			href: '?page=vendorfuel#!/catalog/pricesheets',
		},
		{
			label: 'Uploads',
			href: '?page=vf-admin#/catalog/pricesheets/uploads',
		},
		{
			label: 'Add new upload',
			href: `?page=vf-admin#/catalog/pricesheets/uploads/create`,
		},
	];
	const nextApiURL: string = localized.apiURL.replace('v1', 'v2');
	const templateURL = `${localized.dir.url}assets/downloads/pricesheet-upload-template.xlsx`;

	const [isBusy, setBusy] = useState<boolean>(false);
	const [isDisabled, setDisabled] = useState<boolean>(false);
	const [pricesheets, setPricesheets] = useState<SelectControlOption[]>([
		{ value: '', label: 'Select a price sheet', disabled: true },
	]);
	const [pricesheet, setPricesheet] = useState('');
	const [overwrite, setOverwrite] = useState<boolean>(false);

	const convertToOptions = (
		data: Array<{ sheet: string; price_sheet_id: number }>
	): Array<{ label: string; value: string }> => {
		return data.map((item) => {
			return {
				label: item.sheet,
				value: item.price_sheet_id.toString(),
			};
		});
	};

	const handleUpload = (file: File) => {
		storeCustomerUpload(file);
	};

	const storeCustomerUpload = (file: File) => {
		setBusy(true);
		const url = `${nextApiURL}/admin/pricesheets/batches`;
		const config = {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		};
		const data = new FormData();
		data.append('file', file);
		data.append('price_sheet_id', pricesheet);
		data.append('overwrite', overwrite ? '1' : '0');
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
		const url = `${nextApiURL}/admin/pricesheets/`;
		vfAPI.get(url).then((response) => {
			const options = convertToOptions(response.data.pricesheets.data);
			options.unshift(...pricesheets);
			setPricesheets(options);
		});
	}, []);

	return (
		<>
			<Breadcrumb breadcrumbs={breadcrumbs} />
			<h2>Add upload</h2>
			<Flex gap={3} align="end">
				<SelectControl
					label={`Select which price sheet to ${
						overwrite ? 'overwrite' : 'update'
					}`}
					value={pricesheet}
					options={pricesheets}
					onChange={setPricesheet}
				/>
				<CheckboxControl
					label="Overwrite existing price sheet?"
					checked={overwrite}
					onChange={setOverwrite}
				/>
			</Flex>
			{pricesheet && (
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
