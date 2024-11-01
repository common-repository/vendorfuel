import { useState } from '@wordpress/element';
import { Button, Grid, Stack, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { Layout } from '../../layout/Layout';
import { vfAPI } from '../../shared/vfAPI';

const cookies = new Cookies();
const tokena = cookies.get('vendorfuel-admin-tokena');
const tokenb = cookies.get('vendorfuel-admin-tokenb');

export const ProductUtilities = () => {
	const breadcrumbs = [
		{
			label: 'Catalog',
			to: `/`,
		},
		{
			label: 'Products',
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
		const url = 'products/slug/generate';
		setLoading(true);
		await vfAPI.post(url, {}).then(() => setLoading(false));
	};

	const handleSync = async () => {
		setLoading(true);

		const url = '/wp-json/vendorfuel/syncProductPosts';
		const config = {
			headers: { 'X-WP-Nonce': localized.nonce, tokena, tokenb },
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
			<Grid container spacing={3}>
				<Grid item sm={3} sx={{ display: { xs: 'none', sm: 'block' } }}>
					<Typography variant="subtitle1">
						Sync product detail pages
					</Typography>
				</Grid>
				<Grid item xs={12} sm={9}>
					<Button
						variant="contained"
						onClick={handleSync}
						disabled={loading}
					>
						Sync Product Detail Pages
					</Button>
					<Typography variant="body2" mt={1}>
						Refresh product detail pages so each active product has
						a corresponding public URL (e.g.
						{location.origin}/
						{localized.settings.general.product_slug}/my-product).
						If you have imported or uploaded products and do not see
						your products on the frontend, try this to manually
						refresh the pages.
					</Typography>
				</Grid>
				<Grid item sm={3} sx={{ display: { xs: 'none', sm: 'block' } }}>
					<Typography variant="subtitle1">
						Generate missing slugs
					</Typography>
				</Grid>
				<Grid item xs={12} sm={9}>
					<Button
						variant="outlined"
						onClick={handleGenerateSlugs}
						disabled={loading}
					>
						Generate Missing Slugs
					</Button>
					<Typography variant="body2" mt={1}>
						This will generate slugs for any products where the slug
						is empty, using the product name.
					</Typography>
				</Grid>
				<Grid item sm={3} sx={{ display: { xs: 'none', sm: 'block' } }}>
					<Typography variant="subtitle1">
						Cancel synchronization
					</Typography>
				</Grid>
				<Grid item xs={12} sm={9}>
					<Button
						variant="text"
						color="error"
						onClick={handleDestroySync}
						disabled={loading}
					>
						Cancel Sync
					</Button>
					<Typography variant="body2" mt={1}>
						VendorFuel synchronizes products and categories with
						WordPress whenever a product or category is saved, or
						can be manually synchronized. If you are not seeing your
						product or category on the frontend attempting to sync,
						you can check the status or cancel the synching process.
					</Typography>
				</Grid>
			</Grid>
			<Stack direction="row" spacing={2}></Stack>
		</Layout>
	);
};
