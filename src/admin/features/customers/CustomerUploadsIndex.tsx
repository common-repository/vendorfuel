/* eslint-disable jsx-a11y/anchor-is-valid */
import { Button } from '@wordpress/components';
import { Breadcrumb } from '../../components/ui/Breadcrumb';
import { IndexControl } from '../../components/IndexControl';

export const CustomerUploadsIndex = () => {
	const breadcrumbs = [
		{ name: 'Customers', hash: '#!/customers' },
		{ name: 'Accounts', hash: '#!/customers/accounts' },
		{ name: 'Uploads', hash: '#!/customers/uploads' },
	];
	const headers = [
		{ label: 'ID', value: 'id', isId: true },
		{ label: 'Filename', value: 'filename', isPrimary: true, disabled: true },
		{ label: 'Uploaded', value: 'uploaded_at', isDate: true },
		{ label: 'Started', value: 'started_at', isDate: true },
		{ label: 'Completed', value: 'finished_at', isDate: true },
		{ label: 'Status', value: 'status', isBadge: true },
		{ label: 'Total', value: 'total_records', title: 'Total records', isNumber: true },
		{ label: 'Processed', value: 'processed_records', title: 'Processed records', isNumber: true },
	];
	const filters = [ {
		label: 'Status',
		field: 'status',
		options: [
			{ label: 'All', value: '' },
			{ label: 'Uploaded', value: 'uploaded' },
			{ label: 'Processing', value: 'processing' },
			{ label: 'Failures', value: 'failures' },
			{ label: 'Completed', value: 'completed' },
		],
	} ];
	const nextApiURL = localized.apiURL.replace( 'v1', 'v2' );

	return <>
		<Breadcrumb breadcrumbs={ breadcrumbs } />
		<h2>Uploads
			<Button className="mx-2" variant="secondary" href="#!/customers/uploads/new">Add new</Button>
		</h2>
		<IndexControl headers={ headers } url={ `${ nextApiURL }/admin/customers/batches` } orderBy="uploaded_at" direction="desc" model="batches" filters={ filters } />
	</>;
};
