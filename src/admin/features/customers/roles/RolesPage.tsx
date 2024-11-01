import React, { Component } from 'react';
import { RolesIndex } from './RolesIndex';
import { Layout } from '../../../../../resources/js/Shared/Layout';

export class RolesPage extends Component {
	state = {
		action: {
			label: 'Add new',
			href: '?page=vendorfuel#!/customers/roles/create',
		},
		breadcrumbs: [
			{ label: 'Customers', href: '?page=vf-admin#/customers' },
			{ label: 'Roles', href: '?page=vendorfuel#!/customers/roles' },
		],
	};

	render() {
		return (
			<Layout
				breadcrumbs={this.state.breadcrumbs}
				heading="Roles"
				action={this.state.action}
			>
				<RolesIndex />
			</Layout>
		);
	}
}
