import { SectionGridCards } from '../../components/ui/section-grid-cards';
import sections from '../../features/catalog/sections.json';
import { Layout } from '../../components/ui/layout/layout';
import { Button, Stack } from '@mui/material';
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
			<hr />
			<h2>WordPress synchronization</h2>
			<p>
				VendorFuel synchronizes products and categories with WordPress
				whenever a product or category is saved, or can be manually
				synchronized. If you are not seeing your product or category on
				the front end attempting to sync, you can check the status or
				cancel the synching process.
			</p>
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
