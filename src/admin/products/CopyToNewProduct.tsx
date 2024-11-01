import { Button, Flex, Modal, TextControl } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import PropTypes from 'prop-types';
import { vfAPI } from '../shared/vfAPI';
import type { Localized } from '../types';
import type { Product } from '../catalog/products/Product';

declare const localized: Localized;

export const CopyToNewProduct = (props) => {
	const nextApiURL = localized.apiURL.replace('v1', 'v2');

	const [description, setDescription] = useState<string>(
		`${props.product.description} copy`
	);
	const [isBusy, setBusy] = useState(false);
	const [isOpen, setOpen] = useState(false);
	const [product, setProduct] = useState<Product>({});
	const [sku, setSku] = useState<string>('');

	const openModal = () => setOpen(true);

	const closeModal = () => setOpen(false);

	const handleCopy = () => {
		setProduct(processedProduct(props.product));
	};

	const processedProduct = (input) => {
		const output = {
			description,
			sku,
			status: 'active',
		};

		// Loop through product props and add only if it exists, or the API will complain.
		const keys = [
			'upc',
			'categories',
			'uomid',
			'uomdesc',
			'includes',
			'brand_name',
			'long_description',
			'mfg_part_num',
			'ability_one_sku',
			'green_attributes',
			'hazmat',
			'country',
			'keywords',
			'related',
			'alernates',
			'device',
			'family',
			'model',
			'avatax_tax_code',
			'prop65_warning',
			'manufacturer_id',
			'category_id',
			'uomqty',
			'rebate',
			'green',
			'truck_only',
			'prop65',
			'ignore_inventory',
			'additional_shipping',
		];
		keys.forEach((key) => {
			if (input[key]) {
				output[key] = input[key];
			}
		});

		// Loop through array props.
		const arrayKeys = ['documents'];
		arrayKeys.forEach((key) => {
			if (input[key].length) {
				output[key] = input[key];
			}
		});

		// Loop through attributes.
		if (input.attributes?.length) {
			input.attributes.forEach(
				(attribute: { name: string; value: string }, index: number) => {
					output[`att${index + 1}n`] = attribute.name;
					output[`att${index + 1}d`] = attribute.value;
				}
			);
		}

		return output;
	};

	const storeProduct = (product) => {
		setBusy(true);
		const url = `${nextApiURL}/admin/products`;
		const data = product;
		vfAPI
			.post(url, data)
			.then((response) => {
				if (response.data.product_id) {
					const oldId = location.hash.split('/').pop()!;
					const newId = response.data.product_id;
					location.assign(location.href.replace(oldId, newId));
				}
			})
			.finally(() => {
				setBusy(false);
			});
	};

	useEffect(() => {
		if (product.sku) {
			storeProduct(product);
		}
	}, [product]);

	return (
		<>
			<button className="btn btn-outline-primary" onClick={openModal}>
				Copy to New Product
			</button>
			{isOpen && (
				<Modal
					title={`Copy ${props.product.sku} to new product`}
					onRequestClose={closeModal}
				>
					<form>
						<fieldset disabled={isBusy}>
							<TextControl
								label="SKU (required)"
								help={`Enter a new SKU for ${props.product.sku}`}
								onChange={setSku}
								value={sku}
								required
							/>
							<TextControl
								label="Description (required)"
								onChange={setDescription}
								value={description}
								required
							/>
						</fieldset>
					</form>
					<p>
						Click the Copy button to copy this product. After
						copying, you'll be able to make any further edits.
					</p>
					<Flex justify="end">
						<Button
							isBusy={isBusy}
							onClick={closeModal}
							variant="secondary"
						>
							Cancel
						</Button>
						<Button
							disabled={!sku || !description}
							isBusy={isBusy}
							onClick={handleCopy}
							variant="primary"
						>
							Copy
						</Button>
					</Flex>
				</Modal>
			)}
		</>
	);
};

CopyToNewProduct.propTypes = {
	product: PropTypes.object,
};
