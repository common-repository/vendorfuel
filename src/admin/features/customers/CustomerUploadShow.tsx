import { useEffect, useState } from '@wordpress/element';
import { vfAPI } from '../../lib/vfAPI';
import { Button, Flex, Modal, Spinner } from '@wordpress/components';
import { Breadcrumb } from '../../components/ui/Breadcrumb';
import { Notices } from '../../components/ui/Notices';

interface Batch {
	id: number;
	filename: string;
	status: 'pending'|'confirmed'|'processing'|'processed';
	total_records: number;
	processed_records?: number;
	uploaded_at: string;
	started_at: string;
	finished_at: string;
	failures: {
		data: Failure[];
	};
}
interface Failure {
	id: number;
	customer_batch_id: number;
	row: number;
	failures: string[];
	value: {
		[name:string]: string;
	}
}

export const CustomerUploadShow = () => {
	const initialBreadcrumb = [
		{ name: 'Customers', hash: '#!/customers' },
		{ name: 'Accounts', hash: '#!/customers/accounts' },
		{ name: 'Uploads', hash: '#!/customers/uploads' },
	];

	const [ batch, setBatch ] = useState<Batch>();
	const [ breadcrumbs, setBreadcrumbs ] = useState( initialBreadcrumb );
	const [ failureDetails, setFailureDetails ] = useState<Failure>();
	const [ id, setId ] = useState<number>();
	const [ isBusy, setBusy ] = useState<boolean>( false );
	const [ isOpen, setOpen ] = useState( false );
	const [ notices, setNotices ] = useState( [] );

	const checkId = () => {
		const lastHash = location.hash.split( '/' ).pop();
		if ( lastHash !== 'new' ) {
			setId( Number( lastHash ) );
		}
	};

	const closeModal = () => setOpen( false );

	const showCustomerUpload = () => {
		setBusy( true );
		const url = `${ localized.apiURL }/admin/customers/batches/${ id }`;
		vfAPI.get( url )
			.then( ( response ) => {
				setNotices( response.data.notices );
				if ( response.data.batch ) {
					setBatch( response.data.batch );
				}
				setBusy( false );
			} );
	};

	const handleDetails = ( failure: Failure ) => {
		setFailureDetails( failure );
		openModal();
	};

	const openModal = () => setOpen( true );

	useEffect( () => {
		checkId();
	}, [] );

	useEffect( () => {
		if ( id ) {
			setBreadcrumbs( [ ...initialBreadcrumb, {
				name: id.toString(),
				hash: `#!/customers/uploads/${ id }`,
			} ] );
			showCustomerUpload();
		}
	}, [ id ] );

	useEffect( () => {
		if ( batch ) {
			setBreadcrumbs( [ ...initialBreadcrumb, {
				name: batch.filename,
				hash: `#!/customers/uploads/${ id }`,
			} ] );
		}
	}, [ batch ] );

	return <>
		<Breadcrumb breadcrumbs={ breadcrumbs } />
		<h2>View upload</h2>
		<Notices notices={ notices } />
		{ id &&
		<>
			{ isBusy && ! batch && <Flex justify={ 'center' }><Spinner /></Flex> }
			{ batch &&
				<>
					<table className="widefat striped mb-3">
						<thead>
							<tr>
								<th>ID</th>
								<th>Filename</th>
								<th>Uploaded</th>
								<th>Completed</th>
								<th>Status</th>
								<th>Total records</th>
								<th>Processed records</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>{ batch.id }</td>
								<td className="column-title">
									<strong>
										{ batch.filename }
									</strong>
								</td>
								<td>{ new Date( batch.uploaded_at ).toLocaleString() }</td>
								<td>{ batch.finished_at ? new Date( batch.finished_at ).toLocaleString() : <>&mdash;</> }</td>
								<td style={ { textTransform: 'capitalize' } }>{ batch.status }</td>
								<td>{ batch.total_records.toLocaleString() }</td>
								<td>{ batch.processed_records.toLocaleString() }</td>
							</tr>
						</tbody>
					</table>
					{ batch.failures?.data.length > 0 &&
					<table className="widefat striped mb-3">
						<caption>Failures</caption>
						<thead>
							<tr>
								<th>Row</th>
								<th>Failures</th>
								<th>Details</th>
							</tr>
						</thead>
						<tbody>
							{ batch.failures.data.map( ( failure ) =>
								<tr key={ failure.row }>
									<th scope="row">{ failure.row }</th>
									<td>{ failure.failures.map( ( msg: string ) => <>{ msg }</> ) }</td>
									<td>
										<Button isSmall variant="primary" onClick={ () => {
											handleDetails( failure );
										} }>View</Button>
									</td>
								</tr>,
							) }
						</tbody>
					</table>
					}
					{ isOpen && (
						<Modal title="Failure details" onRequestClose={ closeModal }>
							{ failureDetails &&
							<table className="widefat striped">
								<tbody>
									<tr>
										<th scope="row">Customer batch ID</th>
										<td>{ failureDetails.customer_batch_id }</td>
									</tr>
									<tr>
										<th scope="row">Failures</th>
										<td>{ failureDetails.failures.join() }</td>
									</tr>
									<tr>
										<th scope="row">ID</th>
										<td>{ failureDetails.id }</td>
									</tr>
									<tr>
										<th scope="row">Row</th>
										<td>{ failureDetails.row }</td>
									</tr>
									<tr>
										<th scope="row">Value</th>
										<td>
											<table className="widefat striped">
												<tbody>
													{ Object.entries( failureDetails.value ).map( ( item, i ) =>
														<>{ item[ 0 ] &&
															<tr key={ i }>
																<th scope="row">{ item[ 0 ] }</th>
																<td>{ item[ 1 ] }</td>
															</tr>
														}
														</>,
													) }
												</tbody>
											</table>
										</td>
									</tr>
								</tbody>
							</table>
							}
						</Modal>
					) }
				</>
			}
			{ ! isBusy && ! batch &&
			<Button variant="primary" href="#!/customers/uploads">Go back to uploads</Button>
			}
		</>
		}
	</>;
};
