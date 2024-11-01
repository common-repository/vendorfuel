import { useEffect, useState } from '@wordpress/element';
import Papa from 'papaparse';
import { vfAPI } from '../../../lib/vfAPI';
import { BaseControl, Button, Flex, FormFileUpload, Spinner } from '@wordpress/components';
import { Breadcrumb } from '../../../components/ui/Breadcrumb';
import { Notices } from '../../../components/ui/Notices';

interface Batch {
	batch_id: number;
	columns: {
		[name:string]: string;
	}[];
	file_conflict_action: string;
	filename: string;
	items: {
		[name:string]: string;
	}[];
	time_started: string;
	time_uploaded: string;
	status: 'pending'|'confirmed'|'processing'|'processed';
	total_records: number;
	recordsProcessed?: number;
}

export const ProductUpload = () => {
	const headers: string[] = [
		'Actions',
		'SKU',
		'UPC',
		'Ability One',
		'Uomid',
		'Uomqty',
		'Uomdesc',
		'Name',
		'Includes',
		'Brand Name',
		'Long Description',
		'Manufacturer',
		'MFG Part Num',
		'MFG Website',
		'MFG Logo',
		'Images',
		'Rebate',
		'MSDS',
		'Cat 1',
		'Cat 2',
		'Cat 3',
		'Cat 4',
		'Green Attributes',
		'Green',
		'Haxmat',
		'Truck Only',
		'Country',
		'Keywords',
		'Att1N',
		'Att1D',
		'Att2N',
		'Att2D',
		'Att3N',
		'Att3D',
		'Att4N',
		'Att4D',
		'Att5N',
		'Att5D',
		'Att6N',
		'Att6D',
		'Att7N',
		'Att7D',
		'Att8N',
		'Att8D',
		'Att9N',
		'Att9D',
		'Att10N',
		'Att10D',
		'Att11N',
		'Att11D',
		'Att12N',
		'Att12D',
		'Att13N',
		'Att13D',
		'Att14N',
		'Att14D',
		'Att15N',
		'Att15D',
		'Att16N',
		'Att16D',
		'Att17N',
		'Att17D',
		'Att18N',
		'Att18D',
		'Related',
		'Device',
		'Family',
		'Model',
		'Alternates',
		'Prop 65',
		'Prop 65 Warning',
		'Ignore Inventory',
		'Meta Title',
		'Meta Description',
	];
	const initialBreadcrumb = [
		{ name: 'Catalog', hash: '#!/catalog.page' },
		{ name: 'Products', hash: '#!/catalog/products/0' },
		{ name: 'Uploads', hash: '#!/catalog/products/uploads' },
	];
	const [ batches, setBatches ] = useState<Array<Batch>>( [] );
	const [ breadcrumbs, setBreadcrumbs ] = useState( initialBreadcrumb );
	const [ columns, setColumns ] = useState();
	const [ isConfirmed, setConfirmed ] = useState( false );
	const [ file, setFile ] = useState<File>();
	const [ id, setId ] = useState<number>();
	const [ isBusy, setBusy ] = useState<boolean>( false );
	const [ items, setItems ] = useState( [] );
	const [ limit, setLimit ] = useState( 10 );
	const [ notices, setNotices ] = useState( [] );
	const [ parsedData, setParsedData ] = useState( [] );

	const checkId = () => {
		const lastHash = location.hash.split( '/' ).pop();
		if ( lastHash !== 'new' ) {
			setId( Number( lastHash ) );
		}
	};

	const confirmBatch = () => {
		setBusy( true );
		const url = `${ localized.apiURL }/admin/product/batch/confirm`;
		const data = {
			batch_id: id,
		};
		vfAPI.post( url, data )
			.then( ( response ) => {
				setNotices( response.data.notices );
				if ( ! response.data.errors.length ) {
					setConfirmed( true );
				}
				setBusy( false );
			} );
	};

	const getBatch = () => {
		setBusy( true );
		const url = `${ localized.apiURL }/admin/product/batch/${ id }`;
		vfAPI.get( url )
			.then( ( response ) => {
				setNotices( response.data.notices );
				if ( response.data.batches ) {
					setBatches( response.data.batches );
				}
				setBusy( false );
			} );
	};

	const handleConfirm = () => {
		confirmBatch();
	};

	const handleRefresh = () => {
		getBatch();
	};

	const handleShowAll = () => {
		setLimit( limit + 10 );
	};

	const handleUpload = () => {
		uploadFile();
	};

	const parseFile = () => {
		const regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
		if ( regex.test( file.name.toLowerCase() ) ) {
			Papa.parse( file, {
				complete: ( results ) => {
					setParsedData( results.data );
				},
			} );
		}
	};

	const uploadFile = () => {
		setBusy( true );
		const url = `${ localized.apiURL }/admin/product/batch/upload`;
		const config = {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		};
		const data = new FormData();
		data.append( 'file', file );
		vfAPI.post( url, data, config )
			.then( ( response ) => {
				setBusy( false );
				setNotices( response.data.notices );
				if ( response.data.batch_id ) {
					location.assign( location.href.replace( 'new', response.data.batch_id.toString() ) );
				}
			} );
	};

	useEffect( () => {
		checkId();
	}, [] );

	useEffect( () => {
		if ( id ) {
			setBreadcrumbs( [ ...initialBreadcrumb, {
				name: id.toString(),
				hash: `#!/products/uploads/${ id }`,
			} ] );
			getBatch();
		} else {
			setBreadcrumbs( [ ...initialBreadcrumb, {
				name: 'Add new',
				hash: `#!/products/uploads/new`,
			} ] );
		}
	}, [ id ] );

	useEffect( () => {
		if ( batches?.length ) {
			setBreadcrumbs( [ ...initialBreadcrumb, {
				name: batches[ 0 ].filename,
				hash: `#!/products/uploads/${ id }`,
			} ] );
			setColumns( batches[ 0 ].columns );
			setItems( batches[ 0 ].items );
		}
	}, [ batches ] );

	useEffect( () => {
		if ( file ) {
			parseFile();
		}
	}, [ file ] );

	return <>
		<Breadcrumb breadcrumbs={ breadcrumbs } />
		<h2>{ id ? 'View' : 'Add' } upload</h2>
		<Notices notices={ notices } />
		{ id
			? <>
				{ isBusy && ! batches && <Flex justify={ 'center' }><Spinner /></Flex> }
				{ batches.length > 0 &&
				<>
					<table className="widefat striped mb-3">
						<thead>
							<tr>
								<th>ID</th>
								<th>Filename</th>
								<th>Uploaded</th>
								<th>Status</th>
								<th>File conflict action</th>
								<th>Total records</th>
							</tr>
						</thead>
						<tbody>
							{ batches.map( ( batch ) => <tr key={ batch.batch_id }>
								<td>{ batch.batch_id }</td>
								<td className="column-title">
									<strong>
										{ batch.filename }
									</strong>
								</td>
								<td>{ batch.time_uploaded }</td>
								<td style={ { textTransform: 'capitalize' } }>{ batch.status }</td>
								<td style={ { textTransform: 'capitalize' } }>{ batch.file_conflict_action }</td>
								<td>{ batch.total_records.toLocaleString() }</td>
							</tr> ) }
							{ ! isBusy && ! batches.length &&
							<tr>
								<td colSpan={ 7 }>
									No batches found.
								</td>
							</tr>
							}
						</tbody>
					</table>
					<Button isBusy={ isBusy } disabled={ isConfirmed || batches[ 0 ].status !== 'pending' } variant="primary" onClick={ handleConfirm } >Confirm upload</Button>
					{ columns &&
					<>
						<div className="table-responsive mb-3">
							<table className="widefat striped">
								<caption>Sample of items</caption>
								<thead>
									<tr style={ { whiteSpace: 'nowrap' } }>
										{ Object.entries( columns ).map( ( column ) => <th key={ column[ 0 ] }>{ column[ 1 ] }</th> ) }
									</tr>
								</thead>
								<tbody>
									{ items.map( ( item, index ) =>
										<tr key={ index }>
											{ Object.entries( columns ).map( ( column ) =>
												<td title={ item[ column[ 0 ] ] } key={ column[ 0 ] } style={ { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '60ch' } }>
													{ item[ column[ 0 ] ] || <>&mdash;</> }
												</td>,
											) }
										</tr> )
									}
								</tbody>
							</table>
						</div>
						<Button isBusy={ isBusy } disabled={ isConfirmed || batches[ 0 ].status !== 'pending' } variant="secondary" onClick={ handleRefresh } >Refresh sample</Button>
					</>

					}
				</>
				}
				{ ! isBusy && ! batches.length &&
					<Button variant="primary" href="#!/products/uploads">Go back to uploads</Button>
				}
			</>
			: <>
				<form>
					<fieldset disabled={ isBusy }>
						<FormFileUpload
							accept=".csv,.txt"
							onChange={ ( e ) => setFile( e.target.files[ 0 ] ) }
							render={ ( { openFileDialog } ) => (
								<BaseControl id="file" label={ file ? `${ file.name } (${ Math.round( ( file.size / 1000 ) * 100 ) / 100 } KB)` : '' } help="Upload a spreadsheet file in .csv or .txt format.">

									<Button className={ file ? 'ms-3 me-1' : '' } variant="secondary" onClick={ openFileDialog }>
										Browse
									</Button>
									{ file && <Button variant="primary" onClick={ handleUpload } text="Upload" /> }
								</BaseControl>
							) }
						/>
					</fieldset>
				</form>
				{ parsedData.length > 0 &&
				<>
					<table className="widefat striped sticky-table mb-3">
						<caption>Showing { parsedData.length > limit ? limit.toLocaleString() : parsedData.length.toLocaleString() } { parsedData.length > limit ? ` of ${ parsedData.length.toLocaleString() } ` : '' }items parsed from { file.name }</caption>
						<thead>
							<tr style={ { whiteSpace: 'nowrap' } }>
								{ headers.map( ( header, index ) =>
									<th key={ index }>{ header }</th>,
								) }
							</tr>
						</thead>
						<tbody>
							{ parsedData.map( ( row, index ) =>
								<>
									{ index <= limit &&
									<tr key={ index }>
										{ row.map( ( value: string, i: number ) =>
											<td title={ value } key={ i } style={ { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '60ch' } }>
												{ value || <>&mdash;</> }
											</td>,
										) }
									</tr>
									}
								</>,
							) }
						</tbody>
					</table>
					{ parsedData.length > limit &&
					<Button isBusy={ isBusy } variant="secondary" onClick={ handleShowAll } >Show more</Button>
					}
				</>
				}
			</>
		}
	</>;
};
