import {
	CheckboxControl,
	ComboboxControl,
	Flex,
	FormTokenField,
	TextControl,
} from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import { nextApiURL } from '../data/nextApiURL';
import { vfAPI } from '../shared/vfAPI';
import type { Product } from '../catalog/products/Product';
import type { Option } from '../types';

export const ProductDetails = (props) => {
	const [product, setProduct] = useState<Product>();
	const [options, setOptions] = useState<Option[]>([]);
	const [filterValue, FilterValue] = useState<string>();

	const getManufacturers = () => {
		const params: { q?: string } = {};
		if (filterValue) {
			params.q = filterValue;
		}
		const config = {
			params,
		};
		const url = `${nextApiURL}/admin/manufacturers`;

		vfAPI.get(url, config).then((response) => {
			if (response.data.manufacturers) {
				setOptions(
					response.data.manufacturers.data.map((mfr) => {
						return {
							value: mfr.id,
							label: mfr.name,
						};
					})
				);
			}
		});
	};

	const handleChange = (key: string, value: unknown) => {
		const updatedProduct = { ...product };
		updatedProduct[key] = value;
		setProduct(updatedProduct);
		props.handleChange(key, value);
	};

	const convertToTokens = (input: string): Array<string> => {
		if (input?.length) {
			return input.split(',');
		}
		return [];
	};

	const handleFilterValueChange = debounce((value: string) => {
		FilterValue(value);
	}, 500);

	useEffect(() => {
		setProduct(JSON.parse(props.product));
	}, [props]);

	useEffect(() => {
		if (product?.manufacturer) {
			setOptions([
				{
					value: product.manufacturer.id,
					label: product.manufacturer.name,
				},
			]);
		}
	}, []);

	useEffect(() => {
		getManufacturers();
	}, [filterValue]);

	return (
		<>
			{product && (
				<>
					<TextControl
						label="Brand"
						value={product.brand_name}
						onChange={(value) => handleChange('brand_name', value)}
					/>
					<ComboboxControl
						label="Manufacturer"
						value={product.manufacturer_id}
						onChange={(value) => {
							handleChange('manufacturer_id', value);
						}}
						options={options}
						onFilterValueChange={handleFilterValueChange}
					/>
					<FormTokenField
						label="Keywords"
						value={convertToTokens(product.keywords)}
						onChange={(value) => {
							handleChange('keywords', value.join(','));
						}}
					/>
					<Flex align="top">
						<CheckboxControl
							label="Contains Recycled Content"
							checked={product.green}
							onChange={(value) => handleChange('green', value)}
						/>
						{product.green && (
							<TextControl
								label="Percentage Recycled Content"
								type="number"
								min={0}
								max={100}
								value={product.green_attributes}
								onChange={(value) =>
									handleChange('green_attributes', value)
								}
							/>
						)}
					</Flex>
				</>
			)}
		</>
	);
};

ProductDetails.propTypes = {
	product: PropTypes.string,
	handleChange: PropTypes.func,
};
