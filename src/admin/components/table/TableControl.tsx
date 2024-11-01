import { Button, Card, CardMedia, Flex, Icon } from '@wordpress/components';
import { image } from '@wordpress/icons';
import { SortableHeader } from './SortableHeader';
import { BadgeControl } from '../ui/BadgeControl';
import { TableDataBoolean } from './TableDataBoolean';
import type { Header } from './Header';

interface Props {
	caption?: string;
	hasImage?: boolean;
	headers: Header[];
	indexBase?: string;
	isBusy?: boolean;
	isFixed?: boolean;
	isIndex?: boolean;
	rows: unknown[];
	orderBy?: string;
	direction?: 'asc' | 'desc';
	handleRemove?: (id: number) => void;
	handleOrderChange?: (key: string) => void;
}

export const TableControl = ({
	caption,
	hasImage,
	headers,
	indexBase,
	isBusy,
	isFixed,
	isIndex,
	rows,
	orderBy,
	direction,
	handleOrderChange,
	handleRemove,
}: Props) => {
	const width = (header: Header) => {
		if (header.isPrimary) {
			return '50%';
		}
		return header.isId ? '10ch' : '25%';
	};

	const rowId = (row: unknown[]) => {
		if (!row.id && headers) {
			return row[headers.find((header) => header.isId).value];
		}
		return row.id;
	};

	const renderImage = (img: { thumb_url: string }) => {
		if (img?.thumb_url) {
			return (
				<Card>
					<CardMedia>
						<img
							src={img.thumb_url}
							alt=""
							style={{ width: '24px', height: '24px' }}
						/>
					</CardMedia>
				</Card>
			);
		}
		return (
			<Card>
				<CardMedia>
					<Icon icon={image} style={{ fill: '#B4B9BE' }} />
				</CardMedia>
			</Card>
		);
	};

	const renderIndexLink = (value: string, id: number) => {
		const text = <>{value || '(Untitled)'}</>;
		const base = indexBase || location.hash;
		if (isIndex) {
			return <a href={`${base}/${id}`}>{text}</a>;
		}
		return <span>{text}</span>;
	};

	return (
		<div className="table-responsive">
			<table
				className={`table caption-top mb-3 ${isBusy ? 'is-busy' : ''}`}
			>
				{caption && <caption>{caption}</caption>}
				{headers && (
					<thead>
						<tr>
							{headers.map((header, i) => (
								<>
									{handleOrderChange ? (
										<SortableHeader
											key={i}
											header={header}
											orderBy={orderBy}
											direction={direction}
											handleOrderChange={
												handleOrderChange
											}
											isBusy={isBusy}
										/>
									) : (
										<th
											className={`manage-column ${
												header.isPrimary
													? 'column-primary'
													: ''
											}`}
										>
											{header.label}
										</th>
									)}
								</>
							))}
							{handleRemove && (
								<th
									className="manage-column"
									style={{ width: '25%', textAlign: 'end' }}
								>
									Actions
								</th>
							)}
						</tr>
					</thead>
				)}
				<tbody>
					{rows?.length === 0 && (
						<tr>
							<td
								colSpan={
									headers.length + (handleRemove ? 1 : 0)
								}
							>
								No results found.
							</td>
						</tr>
					)}
					{rows?.length > 0 && (
						<>
							{rows.map((row, i) => (
								<tr key={i}>
									{headers.map((header, j) => (
										<td key={j}>
											{header.isPrimary ? (
												<strong>
													<Flex justify="start">
														{hasImage && (
															<>
																{renderImage(
																	row.image
																)}
															</>
														)}
														{renderIndexLink(
															row[header.value],
															rowId(row)
														)}
													</Flex>
												</strong>
											) : (
												<span>
													{header.isBadge && (
														<BadgeControl
															label={
																row[
																	header.value
																]
															}
														/>
													)}
													{header.isBoolean && (
														<TableDataBoolean
															value={
																row[
																	header.value
																]
															}
														/>
													)}
													{header.isCurrency && (
														<>
															{new Intl.NumberFormat(
																'en-US',
																{
																	style: 'currency',
																	currency:
																		'USD',
																}
															).format(
																row[
																	header.value
																]
															)}
														</>
													)}
													{header.isDate && (
														<>
															{row[
																header.value
															] ? (
																new Date(
																	row[
																		header.value
																	]
																).toLocaleString()
															) : (
																<>&mdash;</>
															)}
														</>
													)}
													{header.isNumber && (
														<>
															{new Number(
																row[
																	header.value
																]
															).toLocaleString()}
														</>
													)}
													{!header.isDate &&
														!header.isNumber &&
														!header.isBadge &&
														!header.isBoolean &&
														!header.isCurrency && (
															<>
																{row[
																	header.value
																] || (
																	<>&mdash;</>
																)}
															</>
														)}
												</span>
											)}
										</td>
									))}
									{handleRemove && (
										<td style={{ textAlign: 'end' }}>
											<button
												className="btn btn-outline-danger border-0 btn-sm"
												disabled={isBusy}
												onClick={() => {
													handleRemove(rowId(row));
												}}
											>
												Remove
											</button>
										</td>
									)}
								</tr>
							))}
						</>
					)}
				</tbody>
			</table>
		</div>
	);
};
