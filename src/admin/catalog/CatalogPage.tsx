import { SectionGridCards } from '../shared/SectionGridCards';
import sections from './sections.json';
import { Layout } from '../layout/Layout';
import { Button, Stack, Typography } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';

export const CatalogPage = () => {
	const handleGetSync = async () => {
		const url = '/wp-json/vendorfuel/sync';
		const config = {
			headers: { 'X-WP-Nonce': localized.nonce },
		};

		await axios.get(url, config).then((response) => {
			toast.info(response.data);
		});
	};

	const handleDestroySync = async () => {
		const url = '/wp-json/vendorfuel/sync';
		const config = {
			headers: { 'X-WP-Nonce': localized.nonce },
		};

		await axios.delete(url, config).then((response) => {
			toast.success(response.data);
		});
	};

	return (
		<Layout heading="Catalog">
			<SectionGridCards sections={sections} />
			<Typography variant="h6" component="h2" gutterBottom>
				WordPress synchronization
			</Typography>
			<Typography variant="body2" gutterBottom>
				VendorFuel synchronizes products and categories with WordPress
				whenever a product or category is saved, or can be manually
				synchronized. If you are not seeing your product or category on
				the frontend attempting to sync, you can check the status or
				cancel the synching process.
			</Typography>
			<Stack direction="row" spacing={2} mt={2}>
				<Button
					onClick={handleGetSync}
					type="button"
					variant="outlined"
				>
					Get Sync Status
				</Button>
				<Button color="error" onClick={handleDestroySync} type="button">
					Cancel Sync
				</Button>
			</Stack>
		</Layout>
	);
};
