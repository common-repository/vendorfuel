import { Flex } from '@wordpress/components';
import React from '@wordpress/element';
import { VendorfuelIcon } from './VendorfuelIcon';
import type { Localized } from '../../types';
declare const localized: Localized;

export const Brand = () => {
	const orange = '#f56e28';

	return (
		<Flex justify="start" align={'baseline'} gap={1}>
			<VendorfuelIcon size={32} />
			<h1 className="wp-heading-inline">
				Vendor
				<span style={{ color: orange }}>Fuel</span>
			</h1>
			{localized && <small>{localized.plugin_data.Version}</small>}
		</Flex>
	);
};
