import React, { Component } from 'react';
import { DocumentProfiles } from './DocumentProfiles';
import { Layout } from '../../../../../resources/js/Shared/Layout';

export class DocumentProfilesPage extends Component {
	state = {
		action: {
			label: 'Add new',
			href: '?page=vendorfuel#!/purchasing/document-profiles/create',
		},
		breadcrumbs: [
			{ label: 'Purchasing', href: '?page=vf-admin#/purchasing' },
			{
				label: 'Document profiles',
				href: '?page=vendorfuel#!/purchasing/document-profiles',
			},
		],
	};

	render() {
		return (
			<Layout
				action={this.state.action}
				breadcrumbs={this.state.breadcrumbs}
				heading="Document profiles"
			>
				<DocumentProfiles />
			</Layout>
		);
	}
}
