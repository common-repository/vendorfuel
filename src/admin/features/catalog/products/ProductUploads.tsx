/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect, useState } from '@wordpress/element';
import { vfAPI } from '../../../lib/vfAPI';
import { Button, Flex, SelectControl, Spinner } from '@wordpress/components';
import { Breadcrumb } from '../../../components/ui/Breadcrumb';
import { Notices } from '../../../components/ui/Notices';
import { SortableTableHeader } from '../../../components/table/SortableTableHeader';

interface Batch {
	time_uploaded: string;
	filename: string;
	status: 'pending'|'confirmed'|'processing'|'processed';
	file_conflict_action: string;
	total_records: number;
	recordsProcessed?: number;
	batch_id: number;
}

export const ProductUploads = () => {
	const breadcrumbs = [
		{ name: 'Catalog', hash: '#!/catalog' },
		{ name: 'Products', hash: '#!/catalog/products/0' },
		{ name: 'Uploads', hash: '#!/catalog/products/uploads' },
	];
	const options = [
		{ label: 'All', value: 'any' },
		{ label: 'Pending', value: 'pending' },
		{ label: 'Confirmed', value: 'confirmed' },
		{ label: 'Processing', value: 'processing' },
		{ label: 'Processed', value: 'processed' },
	];
	const [ batches, setBatches ] = useState<Array<Batch>>();
	const [ isBusy, setBusy ] = useState( true );
	const [ notices, setNotices ] = useState( [] );
	const [ page, setPage ] = useState<number>( 1 );
	const [ pages, setPages ] = useState<number>();
	const [ status, setStatus ] = useState( 'any' );
	const [ orderBy, setOrderBy ] = useState( 'time_uploaded' );
	const [ direction, setDirection ] = useState<'asc'|'desc'>( 'desc' );
	const [ totalResults, setTotalResults ] = useState();

	const confirmBatch = ( e, id: number ) => {
		e.preventDefault();
		setBusy( true );
		const url = `${ localized.apiURL }/admin/product/batch/confirm`;
		const data = {
			batch_id: id,
		};
		vfAPI.post( url, data )
			.then( ( response ) => {
				setNotices( [ ...notices, ...response.data.notices ] );
				getBatches();
			} );
	};

	const getBatches = () => {
		setBusy( true );
		const url = `${ localized.apiURL }/admin/product/batch`;
		const config = {
			params: {
				page,
				status,
				sort_by: orderBy,
				sort_type: direction,
			},
		};
		vfAPI.get( url, config )
			.then( ( response ) => {
				setNotices( [ ...notices, ...response.data.notices ] );
				setBatches( response.data.search_results );
				setPages( response.data.pages );
				setTotalResults( response.data.total_results );
				setBusy( false );
			} );
	};

	const changeSort = ( id: string ) => {
		if ( id === orderBy ) {
			setDirection( direction === 'asc' ? 'desc' : 'asc' );
		} else {
			setOrderBy( id );
		}
	};

	const handleUpdate = () => {
		getBatches();
	};

	const toDate = ( date: string ) => {
		const newDate = new Date( date );
		return newDate.toLocaleString();
	};

	useEffect( () => {
		getBatches();
	}, [ page, orderBy, direction, status ] );

	return <>
		<Breadcrumb breadcrumbs={ breadcrumbs } />
		<h2>Uploads
			<Button className="mx-2" variant="secondary" href="#!/products/uploads/new" isBusy={ isBusy }>Add new</Button>
			<Button variant="secondary" onClick={ handleUpdate } isBusy={ isBusy }>Refresh</Button>
		</h2>
		<Notices notices={ notices } />
		<form>
			<fieldset disabled={ isBusy }>
				<SelectControl label="Status" value={ status } options={ options } onChange={ ( value ) => setStatus( value ) } />
			</fieldset>
		</form>
		{ isBusy && ! batches && <Flex justify={ 'center' }><Spinner /></Flex> }
		{ batches &&
			<>
				<table className="widefat striped mb-3 sticky-table">
					<thead>
						<tr>
							<SortableTableHeader changeSort={ changeSort } orderBy={ orderBy } direction={ direction } label="ID" id="batch_id" />
							<SortableTableHeader changeSort={ changeSort } orderBy={ orderBy } direction={ direction } label="Filename" id="filename" />
							<SortableTableHeader changeSort={ changeSort } orderBy={ orderBy } direction={ direction } label="Uploaded" id="time_uploaded" />
							<SortableTableHeader changeSort={ changeSort } orderBy={ orderBy } direction={ direction } label="Status" id="status" />
							<th>File conflict action</th>
							<SortableTableHeader changeSort={ changeSort } orderBy={ orderBy } direction={ direction } label="Total records" id="total_records" />
							<th>Records processed</th>
						</tr>
					</thead>
					<tbody>
						{ batches.map( ( batch ) => <tr key={ batch.batch_id }>
							<td>{ batch.batch_id }</td>
							<td className="column-title">
								<strong>
									{ batch.status !== 'processed'
										? <a href={ `#!/products/uploads/${ batch.batch_id }` }>
											{ batch.filename }
										</a>
										: <>{ batch.filename }</>
									}
								</strong>
								{ batch.status !== 'processed' &&
									<div className="row-actions visible">
										<a href={ `#!/products/uploads/${ batch.batch_id }` }>
											View
										</a>
										{ batch.status === 'pending' &&
										<>
											<>&thinsp;|&thinsp;</>
											<a href="#" onClick={ ( e ) => confirmBatch( e, batch.batch_id ) }>
												Confirm
											</a>
										</>
										}
									</div>
								}
							</td>
							<td>{ toDate( batch.time_uploaded ) }</td>
							<td style={ { textTransform: 'capitalize' } }>{ batch.status }</td>
							<td style={ { textTransform: 'capitalize' } }>{ batch.file_conflict_action }</td>
							<td>{ batch.total_records.toLocaleString() }</td>
							<td>{ batch.recordsProcessed ? batch.recordsProcessed?.toLocaleString() : <>&mdash;</> }</td>
						</tr> ) }
						{ ! isBusy && ! batches.length &&
							<tr>
								<td colSpan={ 7 }>
									No { status !== 'any' ? `${ status } ` : '' }batches found.
								</td>
							</tr>
						}
					</tbody>
				</table>
				{ pages > 1 &&
				<Flex justify={ 'end' } align={ 'center' }>
					<small className="displaying-num">{ totalResults } items</small>
					<Button isBusy={ isBusy } disabled={ page === 1 } variant="secondary" icon={ 'arrow-left-alt2' } onClick={ () => setPage( page - 1 ) } />
					<small className="tablenav-paging-text">{ page } of { pages }</small>
					<Button isBusy={ isBusy } disabled={ page === pages } variant="secondary" icon={ 'arrow-right-alt2' } onClick={ () => setPage( page + 1 ) } />
				</Flex>
				}
			</>
		}
	</>;
};
