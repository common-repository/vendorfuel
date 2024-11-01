import { useState } from '@wordpress/element';
import { vfApi } from '../../../../lib/vf-api';
import { UploadCreate } from '../../../../shared/UploadCreate';
import { apiURL } from '../../../../data/apiURL';
import breadcrumbBase from '../../../../features/catalog/categories/breadcrumbs.json';
import type { Localized } from '../../../../types';
import { Layout } from '../../../../components/ui/layout/layout';

declare const localized: Localized;

export const CategoryUploadCreate = () => {
	const breadcrumbs = [
		...breadcrumbBase,
		{
			label: 'Uploads',
			to: '..',
		},
		{
			label: 'Upload categories',
			to: `.`,
		},
	];
	const templateURL = `${localized.dir.url}assets/downloads/category-upload-template.xlsx`;

	const [isBusy, setBusy] = useState<boolean>(false);
	const [isDisabled, setDisabled] = useState<boolean>(false);

	const handleUpload = (file: File) => {
		storeCustomerUpload(file);
	};

	const storeCustomerUpload = (file: File) => {
		setBusy(true);
		const url = `${apiURL.CATEGORIES}/batches`;
		const config = {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		};
		const data = new FormData();
		data.append('file', file);
		vfApi.post(url, data, config).then((response) => {
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
		<Layout breadcrumbs={breadcrumbs} heading="Upload categories">
			<UploadCreate
				isBusy={isBusy}
				isDisabled={isDisabled}
				handleUpload={handleUpload}
				templateURL={templateURL}
			/>
		</Layout>
	);
};
