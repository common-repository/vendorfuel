import { useEffect, useState } from '@wordpress/element';
import { Button, ComboboxControl } from '@wordpress/components';
import PropTypes from 'prop-types';
import { TableControl } from '../../../components/table/TableControl';
import { vfAPI } from '../../../shared/vfAPI';
import type { Paginator } from '../../../types';
import type { Rate } from '../../shipping/rates/Rate';

interface Props {
	customerId: number;
	customerRates: Rates;
}

interface Rates extends Paginator {
	data: Rate[];
}

export const CustomerShipping = (props: Props) => {
	const { customerId } = props;
	const headers = [
		{
			label: 'ID',
			value: 'id',
			isId: true,
		},
		{
			label: 'Name',
			value: 'name',
			isPrimary: true,
		},
		{
			label: 'Amount',
			value: 'amount',
			isCurrency: true,
		},
		{
			label: 'Enabled',
			value: 'enabled',
			isBoolean: true,
		},
	];
	const nextApiURL = localized.apiURL.replace('v1', 'v2');

	const [isBusy, setBusy] = useState<boolean>(false);
	const [customerRates, setCustomerRates] = useState<Rates>();
	const [rate, setRate] = useState<Rate | null>();
	const [rates, setRates] = useState<Rates>();
	const [rateOptions, setRateOptions] = useState<
		{ value: string | number; label: string }[]
	>([]);

	const indexRates = () => {
		const url = `${nextApiURL}/admin/shipping/rates`;
		vfAPI.get(url).then((response) => {
			setRates(response.data.rates);
		});
	};

	const handleAdd = () => {
		if (rate) {
			setBusy(true);
			const url = `${nextApiURL}/admin/customers/${customerId}`;
			const data = {
				shipping_flat_rates: [
					{
						id: rate,
					},
				],
			};

			vfAPI.put(url, data).then((response) => {
				if (response.data?.customer) {
					setCustomerRates(
						response.data.customer.shipping_flat_rates
					);
					setRate(null);
					setBusy(false);
				}
			});
		}
	};

	const handleRemove = (id: number) => {
		setBusy(true);
		const url = `${nextApiURL}/admin/customers/${customerId}`;
		const data = {
			shipping_flat_rates: [
				{
					id,
					deleted: true,
				},
			],
		};
		vfAPI.put(url, data).then((response) => {
			if (response.data?.customer) {
				setCustomerRates(response.data.customer.shipping_flat_rates);
				setBusy(false);
			}
		});
	};

	useEffect(() => {
		indexRates();
		if (props.customerRates) {
			setCustomerRates(props.customerRates);
		}
	}, []);

	useEffect(() => {
		if (rates) {
			let options = rates.data.map((el: { id: number; name: string }) => {
				return {
					label: el.name,
					value: el.id,
				};
			});

			if (customerRates?.data) {
				const customerRateIds = customerRates.data.map((el) => el.id);
				options = options.filter((el) => {
					return !customerRateIds.includes(el.value);
				});
			}
			setRateOptions(options);
		}
	}, [customerRates, rates]);

	return (
		<>
			<h3>Shipping rates</h3>
			{rateOptions.length > 0 && (
				<ComboboxControl
					label="Select a flat shipping rate to attach to this customer"
					value={rate}
					onChange={setRate}
					options={rateOptions}
					disabled={isBusy}
				/>
			)}
			{rate && (
				<Button
					isPrimary
					onClick={handleAdd}
					isBusy={isBusy}
					style={{ marginBottom: '.5rem' }}
				>
					Attach Rate
				</Button>
			)}
			{customerRates?.data?.length > 0 && (
				<TableControl
					caption="Attached rates"
					rows={customerRates.data}
					headers={headers}
					handleRemove={handleRemove}
					isBusy={isBusy}
				/>
			)}
		</>
	);
};

CustomerShipping.propTypes = {
	customerRates: PropTypes.object,
	customerId: PropTypes.number,
};
