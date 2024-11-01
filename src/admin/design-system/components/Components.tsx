import React from 'react';
import { Buttons } from './Buttons';
import { Cards } from './Cards';
import { Tables } from './Tables';
import { Tabs } from './Tabs';

export const Components = () => {
	return (
		<section>
			<h2>Components</h2>
			<Buttons />
			<Cards />
			<Tables />
			<Tabs />
		</section>
	);
};
