import { useCallback, useState } from '@wordpress/element';
import { useQuery } from '@tanstack/react-query';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import {
	Alert,
	TextField,
	Button,
	Stack,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	CircularProgress,
	Box,
} from '@mui/material';
import {
	DataGrid,
	GridColDef,
	GridSortModel,
	GridActionsCellItem,
	GridRowParams,
	GridActionsColDef,
} from '@mui/x-data-grid';
import type { SelectChangeEvent } from '@mui/material/Select';
import { Formik } from 'formik';
import { Resource } from './Resource';
import { DeleteDialog } from './DeleteDialog';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DownloadIcon from '@mui/icons-material/Download';
import PreviewIcon from '@mui/icons-material/Preview';

import VisibilityIcon from '@mui/icons-material/Visibility';
import { Service } from './Service';
import { ItemLink } from './ItemLink';
import { PreviewDialog } from './PreviewDialog';

interface Props {
	canDelete?: boolean;
	canDownload?: boolean;
	canEdit?: boolean;
	canView?: boolean;
	columns: GridColDef[];
	queryFn: any;
	getRowId?: (row: any) => number;
	queryKey: string;
	idField?: string;
	paginated?: boolean;
	pathToItem?: string;
	searchable?: boolean;
	searchByOptions?: { value: string; key: string }[];
	service?: Service;
}

export const ResourceIndex = (props: Props) => {
	const DEFAULT_PAGE = 1;
	const DEFAULT_PER_PAGE = 10;
	const DEFAULT_DIRECTION = 'asc';
	const paginationButtonClasses = 'btn btn-outline-primary btn-sm';

	const {
		canDelete = true,
		canDownload = false,
		canEdit = true,
		canView = true,
		getRowId,
		queryFn,
		queryKey = 'index',
		idField = 'id',
		paginated = true,
		pathToItem,
		searchable = false,
		searchByOptions,
		service,
	} = props;

	const [isDownloading, setDownloading] = useState<number>();

	const actions = {
		field: 'Actions',
		type: 'actions',
		width: 50,
		getActions: (params: GridRowParams) => {
			const actionItems = [
				<GridActionsCellItem
					icon={<PreviewIcon />}
					key={0}
					label="Preview"
					onClick={() => handleClickPreview(params)}
					showInMenu
					title="Preview"
				/>,
			];
			if (canEdit || canView) {
				actionItems.push(
					<GridActionsCellItem
						key={1}
						href={pathToItem ? `${pathToItem}/${params.id}` : null}
						icon={canEdit ? <EditIcon /> : <VisibilityIcon />}
						label={canEdit ? 'Edit' : 'View'}
						component={pathToItem ? 'a' : RouterLink}
						showInMenu
						title={canEdit ? 'Edit' : 'View'}
						to={pathToItem ? null : `./${params.id}`}
					/>
				);
			}

			if (canDownload) {
				actionItems.push(
					<GridActionsCellItem
						key={3}
						icon={
							isDownloading === params.id ? (
								<CircularProgress color="inherit" size={20} />
							) : (
								<DownloadIcon />
							)
						}
						label="Download"
						title="Download"
						onClick={() => {
							handleClickDownload(
								Number(params.id),
								params.row.filename
							);
						}}
						showInMenu
					/>
				);
			}
			if (canDelete) {
				actionItems.push(
					<GridActionsCellItem
						key={4}
						icon={<DeleteIcon />}
						label="Delete"
						title="Delete"
						onClick={() => {
							handleClickDelete(params);
						}}
						showInMenu
					/>
				);
			}
			return actionItems;
		},
	};

	const columns = () => {
		const cols: (GridColDef | GridActionsColDef)[] = [
			{
				field: idField,
				headerName: 'ID',
				renderCell: (params) => {
					return canView || canEdit ? (
						<ItemLink params={params} path={pathToItem} />
					) : (
						<>{params.id}</>
					);
				},
				sortable: paginated,
			},
			...props.columns,
			actions,
		];

		return cols;
	};

	const [searchParams, setSearchParams] = useSearchParams({
		direction: DEFAULT_DIRECTION,
		page: DEFAULT_PAGE.toString(),
		orderBy: idField,
		perPage: DEFAULT_PER_PAGE.toString(),
		q: '',
		searchBy: '',
	});
	const direction = searchParams.get('direction') as 'asc' | 'desc';
	const page = searchParams.get('page');
	const perPage = searchParams.get('perPage');
	const orderBy = searchParams.get('orderBy');
	const q = searchParams.get('q');
	const searchBy = searchParams.get('searchBy');

	const handleClickDownload = (id: number, filename: string) => {
		setDownloading(id);
		service.download(id, filename).then((response) => {
			setDownloading(0);
		});
	};

	const handleClickPreview = (newParams) => {
		setParams(newParams);
		setPreviewOpen(true);
	};

	const handleSortModelChange = useCallback((sortModel: GridSortModel) => {
		// Prevent undefined sortModel from triggering query.
		if (sortModel[0]) {
			setSearchParams({
				direction: sortModel[0].sort,
				page,
				perPage,
				orderBy: sortModel[0].field,
				q,
				searchBy,
			});
		}
	}, []);

	const handlePageChange = (newPage: number) => {
		setSearchParams({
			direction,
			page: (newPage + 1).toString(), // Adding 1 since MUI Grid pagination is zero-based.
			perPage,
			orderBy,
			q,
			searchBy,
		});
	};

	const handleChangeSearchBy = (event: SelectChangeEvent) => {
		setSearchParams({
			direction,
			page: DEFAULT_PAGE.toString(),
			orderBy,
			perPage,
			q,
			searchBy: event.target.value,
		});
	};

	const handleRowsPerPageChange = (newPage: number) => {
		setSearchParams({
			direction,
			page,
			perPage: newPage.toString(),
			orderBy,
			q,
			searchBy,
		});
	};

	const { data, isLoading, isFetching, isError, error } = useQuery({
		queryKey: [queryKey, orderBy, direction, page, perPage, q, searchBy],
		queryFn: () =>
			queryFn({ direction, orderBy, page, perPage, q, searchBy }),
		placeholderData: { data: paginated ? { data: [] } : [], total: 0 },
	});

	const [isDeleteOpen, setDeleteOpen] = useState(false);
	const [isPreviewOpen, setPreviewOpen] = useState(false);
	const [params, setParams] = useState<GridRowParams>();

	const handleClickDelete = (newParams: GridRowParams) => {
		setParams(newParams);
		setDeleteOpen(true);
	};

	const NoRowsOverlay = () => {
		return (
			<Stack
				alignItems="center"
				justifyContent="center"
				sx={{ height: '100%' }}
			>
				<span>No items found.</span>
			</Stack>
		);
	};

	return (
		<>
			{searchable || searchByOptions ? (
				<Formik
					initialValues={{ query: q }}
					onSubmit={(values, { setSubmitting }) => {
						setSearchParams({
							direction,
							page: DEFAULT_PAGE.toString(),
							orderBy,
							perPage,
							q: values.query,
							searchBy,
						});
						setSubmitting(false);
					}}
				>
					{({
						values,
						handleChange,
						handleBlur,
						handleSubmit,
						isSubmitting,
					}) => (
						<form onSubmit={handleSubmit}>
							<Stack direction="row" spacing={1} mb={2}>
								<TextField
									autoComplete="none"
									id="query"
									label="Search for"
									value={values.query}
									onChange={handleChange}
									onBlur={handleBlur}
									name="query"
									type="search"
									size="small"
									fullWidth
								/>
								{searchByOptions ? (
									<FormControl
										sx={{ m: 1, minWidth: 120 }}
										size="small"
									>
										<InputLabel id="search-by-options">
											Search by
										</InputLabel>
										<Select
											labelId="search-by-options"
											id="search-by-options"
											value={searchBy}
											label="Search by"
											onChange={handleChangeSearchBy}
										>
											<MenuItem value="">
												<em>All</em>
											</MenuItem>
											{searchByOptions.map((option) => (
												<MenuItem
													key={option.key}
													value={option.key}
												>
													{option.value}
												</MenuItem>
											))}
										</Select>
									</FormControl>
								) : null}
								<Button
									variant="contained"
									type="submit"
									disabled={isSubmitting}
								>
									Search
								</Button>
							</Stack>
						</form>
					)}
				</Formik>
			) : null}
			{isError && (
				<Alert severity="error">{`An error has occurred: ${error.message}`}</Alert>
			)}
			{data ? (
				<>
					<DataGrid
						className="bg-white"
						autoHeight
						columns={columns()}
						components={{ NoRowsOverlay }}
						disableColumnFilter
						disableColumnSelector={true}
						disableColumnMenu={true}
						getRowId={getRowId}
						hideFooter
						loading={isLoading || isFetching}
						onSortModelChange={handleSortModelChange}
						page={Number(page) - 1}
						pageSize={Number(perPage)}
						paginationMode={paginated ? 'server' : 'client'}
						rows={paginated ? data.data : data}
						rowCount={paginated ? data.total : data.length}
						rowsPerPageOptions={[10, 25, 50, 100]}
						sortingMode="server"
						sortingOrder={['desc', 'asc']}
						sortModel={[
							{
								field: orderBy,
								sort: direction,
							},
						]}
					/>
					{data.last_page && (
						<div className="hstack justify-content-between align-items-baseline mt-3">
							<div className="hstack gap-2 align-items-baseline">
								<label
									htmlFor="perPage"
									className="form-label small text-nowrap"
								>
									Number of items per page:
								</label>
								<select
									id="perPage"
									className="form-select"
									onChange={(e) =>
										handleRowsPerPageChange(
											Number(e.target.value)
										)
									}
									value={perPage}
								>
									{[10, 25, 50, 100].map((value) => (
										<option key={value} value={value}>
											{value}
										</option>
									))}
								</select>
							</div>
							<nav
								aria-label="Page navigation"
								className="hstack gap-1 align-items-baseline justify-content-end"
							>
								<span className="small mx-2">
									{data.total.toLocaleString()} items
								</span>
								{/* handlePageChange uses a zero-based page number, while 'page' is not, so the passed page parameters are off by -1. */}
								{data.last_page > 1 ? (
									<>
										<button
											aria-label="First"
											className={paginationButtonClasses}
											onClick={() => handlePageChange(0)}
											disabled={Number(page) === 1}
										>
											<i
												className="bi bi-chevron-double-left"
												aria-hidden={true}
											></i>
										</button>
										<button
											aria-label="Previous"
											className={paginationButtonClasses}
											onClick={() =>
												handlePageChange(
													Number(page) - 2
												)
											}
											disabled={Number(page) === 1}
										>
											<i
												className="bi bi-chevron-left"
												aria-hidden={true}
											></i>
										</button>
										<span className="small mx-2">
											{`${Number(
												page
											).toLocaleString()} of ${data.last_page.toLocaleString()}`}
										</span>
										<button
											aria-label="Next"
											className={paginationButtonClasses}
											disabled={
												Number(page) === data.last_page
											}
											onClick={() =>
												handlePageChange(Number(page))
											}
										>
											<i
												className="bi bi-chevron-right"
												aria-hidden={true}
											></i>
										</button>
										<button
											aria-label="Last"
											className={paginationButtonClasses}
											disabled={
												Number(page) === data.last_page
											}
											onClick={() =>
												handlePageChange(
													Number(data.last_page - 1)
												)
											}
										>
											<i
												className="bi bi-chevron-double-right"
												aria-hidden={true}
											></i>
										</button>
									</>
								) : null}
							</nav>
						</div>
					)}
				</>
			) : null}
			<DeleteDialog
				params={params}
				open={isDeleteOpen}
				service={service}
				setOpen={setDeleteOpen}
				queryKey={queryKey}
			/>
			<PreviewDialog
				params={params}
				open={isPreviewOpen}
				setOpen={setPreviewOpen}
			/>
		</>
	);
};
