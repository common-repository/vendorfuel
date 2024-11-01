import { useEffect, useState } from '@wordpress/element';
import { Button, Flex, Modal } from '@wordpress/components';
import PropTypes from 'prop-types';
import Papa from 'papaparse';
import { Collection } from '../../../catalog/collections/Collection';
import { BadgeControl } from '../../../components/ui/BadgeControl';
import type { Product } from '../../../catalog/products/Product';

/**
 * @see https://support.google.com/merchants/answer/7052112
 */
interface GoogleProduct {
	upc: string;
	id: string;
	title: string;
	description: string;
	link: string;
	image_link: string;
	availability: 'in_stock' | 'out_of_stock' | 'backorder';
	price: string;
	brand: string;
}

export const ExportToGoogleShoppingButton = (props) => {
	const [isOpen, setOpen] = useState<boolean>(false);
	const [products, setProducts] = useState<GoogleProduct[]>([]);

	const availability = (product: Product) => {
		if (product.status === 'active') {
			return 'in_stock';
		} else if (product.status === 'backordered') {
			return 'backordered';
		}
		return 'out_of_stock';
	};

	const closeModal = () => setOpen(false);

	const convertToGoogleProducts = (products) => {
		return products.map((product) => {
			return {
				id: product.sku,
				title: product.description,
				description: product.long_description,
				price: price(product),
				link: link(product),
				availability: availability(product),
				image_link: imageLink(product),
				brand: product.brand_name,
				upc: product.upc,
			};
		});
	};

	const handleDownload = () => {
		const fields = [
			'id',
			'title',
			'description',
			'price',
			'link',
			'availability',
			'image_link',
			'brand',
			'upc',
		];
		const csv = Papa.unparse({ fields, data: products });
		const csvData = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
		const csvURL = window.URL.createObjectURL(csvData);
		const tempLink = document.createElement('a');
		tempLink.href = csvURL;
		tempLink.setAttribute(
			'download',
			`${props.collection.name} for Google Shopping.csv`
		);
		tempLink.click();
	};

	const imageLink = (product: Product) => {
		return product.image ? product.image.orig_url : null;
	};

	const link = (product: Product) => {
		if (product.slug) {
			return `${location.origin}/products/${product.slug}`;
		}
	};

	const price = (product: Product) => {
		const locales = 'en-US';
		const options = {
			style: 'currency',
			currency: 'USD',
			currencyDisplay: 'name',
		};

		if (product.pricesheets?.length) {
			return new Intl.NumberFormat(locales, options)
				.format(product.pricesheets[0].price)
				.replace('US dollars', 'USD');
		}
	};

	const openModal = () => setOpen(true);

	useEffect(() => {
		if (props.collection?.products) {
			setProducts(
				convertToGoogleProducts(props.collection.products.data)
			);
		}
	}, [props]);

	return (
		<>
			<button className="btn btn-outline-primary" onClick={openModal}>
				Export CSV for Google Shopping
			</button>
			{isOpen && (
				<Modal title="Preview CSV data" onRequestClose={closeModal}>
					<table className="table table-sm caption-top">
						<caption>Product data preview</caption>
						<thead>
							<tr>
								<th scope="col">id</th>
								<th scope="col">title</th>
								<th scope="col">description</th>
								<th scope="col">price</th>
								<th scope="col">link</th>
								<th scope="col">availability</th>
								<th scope="col">image_link</th>
								<th scope="col">brand</th>
								<th scope="col">upc</th>
							</tr>
						</thead>
						<tbody>
							{products.map((product) => (
								<tr>
									<td>
										{product.id || (
											<BadgeControl label="Missing" />
										)}
									</td>
									<td>
										{product.title || (
											<BadgeControl label="Missing" />
										)}
									</td>
									<td>
										{product.description || (
											<BadgeControl label="Missing" />
										)}
									</td>
									<td>
										{product.price || (
											<BadgeControl label="Missing" />
										)}
									</td>
									<td>
										{product.link || (
											<BadgeControl label="Missing" />
										)}
									</td>
									<td>
										{product.availability || (
											<BadgeControl label="Missing" />
										)}
									</td>
									<td>
										{product.image_link || (
											<BadgeControl label="Missing" />
										)}
									</td>
									<td>
										{product.brand || (
											<BadgeControl label="Missing" />
										)}
									</td>
									<td>
										{product.upc || (
											<BadgeControl label="Missing" />
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
					<Flex justify={'end'} style={{ marginTop: '1rem' }}>
						<button
							className="btn btn-outline-primary"
							onClick={closeModal}
						>
							Cancel
						</button>
						<button
							className="btn btn-primary"
							onClick={handleDownload}
						>
							Download
						</button>
					</Flex>
				</Modal>
			)}
		</>
	);
};

ExportToGoogleShoppingButton.propTypes = {
	collection: PropTypes.instanceOf(Collection),
};
