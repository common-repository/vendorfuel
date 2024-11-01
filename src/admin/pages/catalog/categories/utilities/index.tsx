import { useState } from '@wordpress/element';
import { Button } from '@wordpress/components';
import { toast } from 'react-toastify';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { Layout } from '../../../../components/ui/layout/layout';
import { vfApi } from '../../../../lib/vf-api';

const cookies = new Cookies();
const tokena = cookies.get('vendorfuel-admin-tokena');
const tokenb = cookies.get('vendorfuel-admin-tokenb');

export const CategoryUtilities = () => {
	const breadcrumbs = [
		{
			label: 'Catalog',
			to: `/`,
		},
		{
			label: 'Categories',
			to: `..`,
		},
		{
			label: 'Utilities',
			to: `.`,
		},
	];

	const handleDestroySync = async () => {
		setLoading(true);
		const url = '/wp-json/vendorfuel/sync';
		const config = {
			headers: { 'X-WP-Nonce': localized.nonce, tokena, tokenb },
		};

		await axios.delete(url, config).then((response) => {
			toast.success(response.data);
			setLoading(false);
		});
	};

	const handleGenerateSlugs = async () => {
		const url = 'categories/slug/generate';
		setLoading(true);
		await vfApi.post(url, {}).then(() => setLoading(false));
	};

	const handlePopulateImages = async () => {
		const url = 'categories/images/fill';
		setLoading(true);
		await vfApi.post(url, {}).then(() => setLoading(false));
	};

	const handleSync = async () => {
		setLoading(true);

		const url = '/wp-json/vendorfuel/syncCategoryPosts';
		const config = {
			headers: {
				'X-WP-Nonce': localized.nonce,
				tokena,
				tokenb,
			},
		};

		await axios.get(url, config).then((response) => {
			if (!response.data.errors.length) {
				toast.success(response.data.notifications[0]);
			}
			setLoading(false);
		});
	};

	const [loading, setLoading] = useState<boolean>(false);

	return (
		<Layout heading="Utilities" breadcrumbs={breadcrumbs}>
			<table className="form-table" role="presentation">
				<tbody>
					<tr>
						<th scope="row">Category Pages</th>
						<td>
							<Button
								disabled={loading}
								onClick={handleSync}
								variant="primary"
							>
								Sync Category Pages
							</Button>
							<p className="description">
								Refresh category pages so each category with
								active products has a corresponding public URL
								(e.g.{' '}
								<code>
									{location.origin}/
									{localized.settings.general.cat_slug}
									/my-product
								</code>
								). If you have imported or uploaded products and
								do not see your products on the front end, try
								this to manually refresh the pages.
							</p>
						</td>
					</tr>
					<tr>
						<th scope="row">Category Slugs</th>
						<td>
							<Button
								disabled={loading}
								onClick={handleGenerateSlugs}
								variant="secondary"
							>
								Generate Missing Slugs
							</Button>
							<p className="description">
								This will generate slugs for any categories
								where the slug is empty, using the category
								name.
							</p>
						</td>
					</tr>
					<tr>
						<th scope="row">Category Images</th>
						<td>
							<Button
								disabled={loading}
								onClick={handlePopulateImages}
								variant="tertiary"
							>
								Populate Empty Images
							</Button>
							<p className="description">
								This will populate any empty category images
								using a product image assigned to that specific
								category.
							</p>
						</td>
					</tr>
					<tr>
						<th scope="row">Synchronization</th>
						<td>
							<Button
								disabled={loading}
								isDestructive
								onClick={handleDestroySync}
								variant="tertiary"
							>
								Cancel Sync
							</Button>
							<p className="description">
								VendorFuel synchronizes products and categories
								with WordPress whenever a product or category is
								saved, or can be manually synchronized. If you
								are not seeing your product or category on the
								front end attempting to sync, you can check the
								status or cancel the synching process.
							</p>
						</td>
					</tr>
				</tbody>
			</table>
		</Layout>
	);
};
