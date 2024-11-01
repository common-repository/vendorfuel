import React, { useEffect, useState } from '@wordpress/element';
import { RadioControl } from '@wordpress/components';
import { toast } from 'react-toastify';
import { SectionCards } from '../components/ui/SectionCards';
import { withAuth } from '../components/withAuth';
import sections from '../data/shippingSections.json';
import { vfAPI } from '../lib/vfAPI';

const Page = () => {
	const options = [
		{ label: 'Free', value: 'free' },
		{ label: 'Flat rate', value: 'flat_rate' },
		{ label: 'Parcel', value: 'parcel' },
	];
	const url = `${localized.apiURL}/admin/shipping/mode`;

	const [isBusy, setBusy] = useState<boolean>(true);
	const [mode, setMode] = useState<'free' | 'flat_rate' | 'parcel'>();

	const getMode = () => {
		vfAPI.get(url).then((response) => {
			if (!response?.data?.errors.length) {
				setMode(response.data.mode);
				setBusy(false);
			}
		});
	};

	const handleChange = (value: 'free' | 'flat_rate' | 'parcel') => {
		updateMode(value);
	};

	const updateMode = (value: 'free' | 'flat_rate' | 'parcel') => {
		setBusy(true);
		const data = {
			mode: value,
		};
		vfAPI.put(url, data).then((response) => {
			if (!response?.data?.errors.length) {
				toast.info('Shipping mode updated.', { icon: false });
				if (response.data.mode) {
					setMode(response.data.mode);
				}
				setBusy(false);
			}
		});
	};

	useEffect(() => {
		getMode();
	}, []);

	return (
		<>
			<h2>Shipping</h2>
			<form>
				<fieldset disabled={isBusy}>
					<RadioControl
						label="Shipping mode"
						selected={mode}
						options={options}
						onChange={handleChange}
					/>
				</fieldset>
			</form>
			<SectionCards sections={sections} />
		</>
	);
};

export const ShippingPage = withAuth(Page);
