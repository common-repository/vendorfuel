import { useEffect, useState } from '@wordpress/element';
import { useQuery } from '@tanstack/react-query';
import { Spinner } from '../spinner/Spinner';
import {
	Alert,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableFooter,
	TableHead,
	TablePagination,
	TableRow,
} from '@mui/material';
import { renderBadge } from '../../shared/renderBadge';
import { renderTimestamp } from '../../shared/renderTimestamp';
import type { Dictionary } from '../../models/dictionary';
import { Params } from '../../models/params';
import { useParams, useSearchParams } from 'react-router-dom';
import { renderNumber } from '../../shared/renderNumber';

interface Details {
	value: Dictionary;
	messages?: string[];
	failures?: string[];
	id: number;
	row: number;
}

interface DialogProps {
	details: Details;
	open: boolean;
	onClose: () => void;
}

interface Props {
	queryKey: string;
	queryFn: (id: number | string, params: Params) => Promise<any>;
	setBreadcrumbs: React.Dispatch<
		React.SetStateAction<
			{
				label: string;
				href?: string;
				to?: string;
			}[]
		>
	>;
}

const UploadDetailsDialog = (props: DialogProps) => {
	const { details, onClose, open } = props;

	const handleClose = () => {
		onClose();
	};

	return (
		<Dialog onClose={handleClose} open={open}>
			{details ? (
				<>
					<DialogTitle>Row {details.row} details</DialogTitle>
					<DialogContent>
						<Table size="small">
							<TableHead>
								<TableRow>
									<TableCell component="th" scope="row">
										Header
									</TableCell>
									<TableCell component="th" scope="row">
										Value
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{Object.entries(details.value).map((row) => (
									<TableRow key={row[0]}>
										<TableCell>{row[0]}</TableCell>
										<TableCell>{row[1]}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</DialogContent>
				</>
			) : null}
			<DialogActions>
				<Button variant="contained" onClick={handleClose}>
					Close
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export const UploadShow = (props: Props) => {
	const DEFAULT_PAGE = 1;
	const DEFAULT_PER_PAGE = 10;

	const { queryFn, queryKey, setBreadcrumbs } = props;

	const [searchParams, setSearchParams] = useSearchParams({
		page: DEFAULT_PAGE.toString(),
		perPage: DEFAULT_PER_PAGE.toString(),
	});

	const { id } = useParams();
	const page = searchParams.get('page');
	const perPage = searchParams.get('perPage');
	const [details, setDetails] = useState<Details>();
	const [open, setOpen] = useState(false);
	const [hasResolved, setResolved] = useState(false);

	const handleClickOpen = (value: Details) => {
		setDetails(value);
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handlePageChange = (
		event: React.MouseEvent<HTMLButtonElement> | null,
		newPage: number
	) => {
		setSearchParams({
			page: (newPage + 1).toString(),
			perPage,
		});
	};

	const handleRowsPerPageChange = (
		event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
	) => {
		setSearchParams({
			page,
			perPage: event.target.value,
		});
	};

	const { data, isLoading, isSuccess, isError, error } = useQuery({
		queryKey: [queryKey, page, perPage],
		queryFn: () => queryFn(id, { page, perPage }),
	});

	// Set hasResolved once so that the breadcrumbs can be updated only once after the data loads.
	useEffect(() => {
		if (data && !hasResolved) {
			setResolved(true);
		}
	}, [data]);

	// Update the breadcrumbs once the query has resolved,
	useEffect(() => {
		if (hasResolved) {
			setBreadcrumbs((prev) => [
				...prev,
				{
					label: data.filename,
					href: location.href,
				},
			]);
		}
	}, [hasResolved]);

	return (
		<>
			{isLoading && <Spinner />}
			{isError && (
				<Alert severity="error">{`An error has occurred: ${error.message}`}</Alert>
			)}
			{isSuccess && (
				<>
					<h2>{data.filename}</h2>

					<TableContainer component={Paper} sx={{ marginBottom: 2 }}>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell component="th">ID</TableCell>
									<TableCell component="th">
										Filename
									</TableCell>
									<TableCell component="th">Status</TableCell>
									<TableCell component="th">Rows*</TableCell>
									<TableCell component="th">
										Processed
									</TableCell>
									<TableCell component="th">
										Uploaded
									</TableCell>
									<TableCell component="th">
										Started
									</TableCell>
									<TableCell component="th">
										Completed
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								<TableRow>
									<TableCell>{data.id}</TableCell>
									<TableCell>{data.filename}</TableCell>
									<TableCell>
										{renderBadge(data.status)}
									</TableCell>
									<TableCell>
										{renderNumber(data.total_records)}
									</TableCell>
									<TableCell>
										{renderNumber(data.processed_records)}
									</TableCell>
									<TableCell>
										{renderTimestamp(data.uploaded_at)}
									</TableCell>
									<TableCell>
										{renderTimestamp(data.started_at)}
									</TableCell>
									<TableCell>
										{renderTimestamp(data.finished_at)}
									</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</TableContainer>
					<p className="description">
						*Empty rows are included in this count.
					</p>
					{data.success.data.length ? (
						<>
							<h3>Processed</h3>
							<TableContainer
								component={Paper}
								sx={{ marginBottom: 2 }}
							>
								<Table size="small">
									<TableHead>
										<TableRow>
											<TableCell component="th">
												Row
											</TableCell>
											<TableCell component="th">
												Messages
											</TableCell>
											<TableCell component="th">
												Details
											</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{data.success.data.map(
											(row: Details) => (
												<TableRow key={row.id}>
													<TableCell>
														{row.row}
													</TableCell>
													<TableCell>
														{row.messages.join(' ')}
													</TableCell>
													<TableCell>
														<Button
															size="small"
															onClick={() =>
																handleClickOpen(
																	row
																)
															}
														>
															View Details
														</Button>
													</TableCell>
												</TableRow>
											)
										)}
									</TableBody>
									{data.success.total ? (
										<TableFooter>
											<TableRow>
												<TablePagination
													showFirstButton
													showLastButton
													count={data.success.total}
													onPageChange={
														handlePageChange
													}
													page={
														data.success
															.current_page - 1
													}
													rowsPerPage={Number(
														perPage
													)}
													onRowsPerPageChange={
														handleRowsPerPageChange
													}
												/>
											</TableRow>
										</TableFooter>
									) : null}
								</Table>
							</TableContainer>
						</>
					) : null}
					{data.failures.data.length ? (
						<>
							<h3>Failures</h3>
							<TableContainer
								component={Paper}
								sx={{ marginBottom: 2 }}
							>
								<Table size="small">
									<TableHead>
										<TableRow>
											<TableCell component="th">
												Row
											</TableCell>
											<TableCell component="th">
												Messages
											</TableCell>
											<TableCell component="th">
												Details
											</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{data.failures.data.map(
											(row: Details) => (
												<TableRow key={row.id}>
													<TableCell>
														{row.row}
													</TableCell>
													<TableCell>
														{row.failures.join(' ')}
													</TableCell>
													<TableCell>
														<Button
															size="small"
															onClick={() =>
																handleClickOpen(
																	row
																)
															}
														>
															View Details
														</Button>
													</TableCell>
												</TableRow>
											)
										)}
									</TableBody>
									{data.failures.total ? (
										<TableFooter>
											<TableRow>
												<TablePagination
													showFirstButton
													showLastButton
													count={data.failures.total}
													onPageChange={
														handlePageChange
													}
													page={
														data.failures
															.current_page - 1
													}
													rowsPerPage={Number(
														perPage
													)}
													onRowsPerPageChange={
														handleRowsPerPageChange
													}
												/>
											</TableRow>
										</TableFooter>
									) : null}
								</Table>
							</TableContainer>
						</>
					) : null}
					{JSON.stringify}
				</>
			)}
			<UploadDetailsDialog
				details={details}
				open={open}
				onClose={handleClose}
			/>
		</>
	);
};
