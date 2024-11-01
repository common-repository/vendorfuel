import { useEffect, useState } from '@wordpress/element';
import Papa from 'papaparse';
import { DropZone, FormFileUpload } from '@wordpress/components';
import { toast } from 'react-toastify';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import {
	Alert,
	Button,
	CircularProgress,
	FormControl,
	Stack,
	Typography,
} from '@mui/material';
import { Spinner } from '../components/spinner/Spinner';

interface Props {
	handleUpload: (file: File) => void;
	isBusy: boolean;
	isDisabled: boolean;
	templateHeaders?: string[];
	templateURL?: string;
}

export const UploadCreate = ({
	handleUpload,
	isBusy,
	isDisabled,
	templateHeaders,
	templateURL,
}: Props) => {
	const MILLION = 1000000;

	const figureStyle = {
		padding: 0,
		margin: '0 0 1rem 0',
	};

	const tableStyle = {
		border: 0,
	};

	const headerStyle = {
		position: 'sticky',
		top: 0,
		background: 'white',
	};

	const wrapStyle = {
		maxHeight: '65vh',
		overflow: 'auto',
		border: '1px solid #c3c4c7',
	};

	const [data, setData] = useState<any | null>();
	const [error, setError] = useState<string | null>();
	const [file, setFile] = useState<File>();
	const [hasParsed, setHasParsed] = useState<boolean>(false);

	const [limit, setLimit] = useState(10);
	const [headers, setHeaders] = useState<Array<string> | null>();
	const [results, setResults] = useState();

	const canBeParsed = (name: string) => {
		return name.endsWith('csv') || name.endsWith('txt');
	};

	const checkHeaders = (fields: string[]) => {
		if (hasEmptyHeaders(fields)) {
			setError(
				`Your spreadsheet is missing headers. Please edit your file or upload another one.`
			);
		} else if (hasBadCharacters(fields)) {
			setError(
				`Your spreadsheet headers contain uppercase characters and/or spaces. Please edit your file or upload another one.`
			);
		} else {
			setHeaders(fields.filter((field) => field));
		}
	};

	const handleChange = (e) => {
		setError(null);
		setFile(e.target.files[0]);
		setData(null);
		setHeaders(null);
	};

	const handleCSVDownload = () => {
		const csv = Papa.unparse({ fields: templateHeaders });
		const csvData = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
		const csvURL = window.URL.createObjectURL(csvData);
		const tempLink = document.createElement('a');
		tempLink.href = csvURL;
		tempLink.setAttribute('download', 'template.csv');
		tempLink.click();
	};

	const handleDrop = (files) => {
		setError(null);
		setFile(files[0]);
		setData(null);
		setHeaders(null);
	};

	const handleShowAll = () => {
		setLimit(limit + 10);
	};

	const hasBadCharacters = (arr: string[]): boolean => {
		return arr.some((value) => value.match(/[A-Z|\s]/g));
	};

	const hasEmptyHeaders = (arr: string[]) => {
		/* Flag headers containing empty strings vs. empty strings on end. */
		if (arr.some(isEmpty)) {
			return arr.slice(arr.findIndex(isEmpty)).join('').length
				? true
				: false;
		}
	};

	const isEmpty = (value: string) => value === '';

	const parseFile = () => {
		setHasParsed(false);
		Papa.parse(file, {
			dynamicTyping: true,
			header: true,
			skipEmptyLines: true,
			complete: (parsedResults) => {
				setResults(parsedResults);
				setHasParsed(true);
			},
		});
	};

	useEffect(() => {
		if (file && canBeParsed(file.name)) {
			parseFile();
		}
	}, [file]);

	useEffect(() => {
		if (results) {
			setData(results.data);
			checkHeaders(results.meta.fields);
		}
	}, [results]);

	useEffect(() => {
		toast.error(error, {
			autoClose: false,
		});
	}, [error]);

	return (
		<>
			<Typography variant="body2" mb={2}>
				Please upload or drop a spreadsheet file in .csv, .ods, .txt,
				.xls, or .xlsx format. Only text and comma delimited value (CSV)
				files can be previewed.
			</Typography>
			<form>
				<fieldset disabled={isBusy || isDisabled}>
					<FormFileUpload
						accept="text/csv, text/plain, application/vnd.oasis.opendocument.spreadsheet, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
						onChange={handleChange}
						render={({ openFileDialog }) => (
							<>
								<FormControl>
									<Stack
										direction="row"
										spacing={1}
										alignItems="center"
										mb={2}
									>
										{file && (
											<Typography variant="body1">{`${
												file.name
											} (${new Intl.NumberFormat(
												'en-US',
												{
													style: 'unit',
													unit: 'megabyte',
												}
											).format(
												file.size / MILLION
											)})`}</Typography>
										)}
										{file && (
											<Button
												variant="contained"
												disabled={isBusy || isDisabled}
												startIcon={
													isBusy ? (
														<CircularProgress
															size={20}
															color="inherit"
														/>
													) : (
														<UploadIcon />
													)
												}
												onClick={() =>
													handleUpload(file)
												}
											>
												Upload
											</Button>
										)}
										<Button
											disabled={isBusy || isDisabled}
											variant="outlined"
											onClick={openFileDialog}
										>
											Browse
										</Button>
										{templateHeaders?.length && (
											<Button
												disabled={isBusy || isDisabled}
												variant="outlined"
												startIcon={<DownloadIcon />}
												onClick={handleCSVDownload}
											>
												Download CSV Template
											</Button>
										)}
										{templateURL && (
											<Button
												disabled={isBusy || isDisabled}
												href={templateURL}
												download="template.xlsx"
												variant="outlined"
												startIcon={<DownloadIcon />}
											>
												Download Template
											</Button>
										)}
									</Stack>
								</FormControl>
								{file?.size > MILLION ? (
									<Alert severity="warning">
										Files larger than 1 MB may take several
										seconds to upload.
									</Alert>
								) : null}
							</>
						)}
					/>

					<DropZone
						onFilesDrop={(files) => {
							handleDrop(files);
						}}
					/>
				</fieldset>
			</form>
			{file && canBeParsed(file.name) && !hasParsed && <Spinner />}
			{hasParsed && data && headers && (
				<>
					<figure style={figureStyle}>
						<figcaption>
							<p>
								Showing{' '}
								{data.length > limit
									? limit.toLocaleString()
									: data.length.toLocaleString()}{' '}
								{data.length > limit
									? ` of ${data.length.toLocaleString()} `
									: ''}
								items parsed from {file.name}
							</p>
						</figcaption>
						<div style={wrapStyle}>
							<table
								className="table bg-white"
								style={tableStyle}
							>
								<thead style={headerStyle}>
									<tr>
										{headers.map((header: string) => (
											<th key={header}>{header}</th>
										))}
									</tr>
								</thead>
								<tbody>
									{data.map((row, index: number) => (
										<>
											{index <= limit && (
												<tr key={index}>
													{headers.map(
														(
															header: string,
															i: number
														) => (
															<td key={i}>
																{row[header]}
															</td>
														)
													)}
												</tr>
											)}
										</>
									))}
								</tbody>
							</table>
						</div>
					</figure>
					{data.length > limit && (
						<Button disabled={isBusy} onClick={handleShowAll}>
							Show More
						</Button>
					)}
				</>
			)}
		</>
	);
};
