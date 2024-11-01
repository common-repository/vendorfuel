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
		await vfAPI.post(url, {}).then(() => setLoading(false));
	};

	const handlePopulateImages = async () => {
		const url = 'categories/images/fill';
		setLoading(true);
		await vfAPI.post(url, {}).then(() => setLoading(false));
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
			<Grid container spacing={3}>
				<Grid item sm={3} sx={{ display: { xs: 'none', sm: 'block' } }}>
					<Typography variant="subtitle1">
						Sync category pages
					</Typography>
				</Grid>
				<Grid item xs={12} sm={9}>
					<Button
						variant="contained"
						onClick={handleSync}
						disabled={loading}
					>
						Sync Category Pages
					</Button>
					<Typography variant="body2" mt={1}>
						Refresh category pages so each category with active
						products has a corresponding public URL (e.g.
						{location.origin}/{localized.settings.general.cat_slug}
						/my-product). If you have imported or uploaded products
						and do not see your products on the frontend, try this
						to manually refresh the pages.
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
						This will generate slugs for any categories where the
						slug is empty, using the category name.
					</Typography>
				</Grid>
				<Grid item sm={3} sx={{ display: { xs: 'none', sm: 'block' } }}>
					<Typography variant="subtitle1">
						Populate empty images
					</Typography>
				</Grid>
				<Grid item xs={12} sm={9}>
					<Button
						variant="text"
						onClick={handlePopulateImages}
						disabled={loading}
					>
						Populate Empty Images
					</Button>
					<Typography variant="body2" mt={1}>
						This will populate any empty category images using a
						product image assigned to that specific category.
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
