import React, { useEffect, useState } from '@wordpress/element';
import Papa from 'papaparse';
import {
	BaseControl,
	Button,
	Card,
	CardBody,
	DropZone,
	Flex,
	FormFileUpload,
	Spinner,
} from '@wordpress/components';
import { toast } from 'react-toastify';

interface Props {
	handleUpload: (file: File) => void;
	isBusy: boolean;
	isDisabled: boolean;
	templateHeaders?: string[];
	templateURL?: string;
}

export const BatchUploader = ({
	handleUpload,
	isBusy,
	isDisabled,
	templateHeaders,
	templateURL,
}: Props) => {
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
	const isNotEmpty = (value: string) => value !== '';

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
			<form>
				<fieldset disabled={isBusy || isDisabled}>
					<div>
						<Card>
							<CardBody>
								<FormFileUpload
									accept="text/csv, text/plain, application/vnd.oasis.opendocument.spreadsheet, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
									onChange={handleChange}
									render={({ openFileDialog }) => (
										<BaseControl
											id="file"
											help="Please upload or drop a spreadsheet file in .csv, .ods, .txt, .xls, or .xlsx format. Only text and comma delimited value (CSV) files can be previewed."
										>
											<Flex justify={'start'} gap={2}>
												{file && (
													<BaseControl.VisualLabel>{`${
														file.name
													} (${
														Math.round(
															(file.size / 1000) *
																100
														) / 100
													} KB)`}</BaseControl.VisualLabel>
												)}
												{file && (
													<Button
														isBusy={isBusy}
														isPrimary
														onClick={() =>
															handleUpload(file)
														}
														text="Upload"
													/>
												)}
												<Button
													isSecondary
													onClick={openFileDialog}
												>
													Browse or drop file
												</Button>
												{templateHeaders?.length && (
													<Button
														isBusy={isBusy}
														isTertiary
														onClick={
															handleCSVDownload
														}
														text="Download CSV template"
														icon="download"
													/>
												)}
												{templateURL && (
													<Button
														isBusy={isBusy}
														isTertiary
														href={templateURL}
														download="template.xlsx"
														text="Download template"
														icon="download"
													/>
												)}
											</Flex>
										</BaseControl>
									)}
								/>
							</CardBody>
							<DropZone
								onFilesDrop={(files) => {
									handleDrop(files);
								}}
							/>
						</Card>
					</div>
				</fieldset>
			</form>
			{file && canBeParsed(file.name) && !hasParsed && (
				<Flex justify="center">
					<Spinner />
				</Flex>
			)}
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
								className="widefat striped"
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
						<Button
							isBusy={isBusy}
							variant="secondary"
							onClick={handleShowAll}
						>
							Show more
						</Button>
					)}
				</>
			)}
		</>
	);
};
