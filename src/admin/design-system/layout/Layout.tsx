import React from 'react';
import { Edit } from './Edit';
import { Index } from './Index';
import { View } from './View';

export const Layout = () => {
	const contexts = [
		'primary',
		'secondary',
		'success',
		'danger',
		'warning',
		'info',
		'light',
		'dark',
	];

	return (
		<>
			<h2>Layout</h2>
			<p>
				Every page in the plugin is to follow an index, view and edit
				layout.
			</p>
			{/* <Index /> */}
			{/* <View /> */}
			<Edit />
		</>
	);
};
