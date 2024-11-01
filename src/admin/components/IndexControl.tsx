import { Button, Flex, SelectControl } from '@wordpress/components';
import { chevronLeft, chevronRight, next, previous } from '@wordpress/icons';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import Qs from 'qs';
import { vfAPI } from '../lib/vfAPI';
import { TableControl } from './table/TableControl';
import { SearchControl } from './ui/SearchControl';
import type { Params, Paginator } from '../types';
import type { Header } from '../components/table/Header';
import { Spinner } from '../../../resources/js/Shared/Spinner';

interface Props {
	direction?: 'asc' | 'desc';
	filters?: {
		label: string;
		field: string;
		options: {
			label: string;
			value: string;
		}[];
	}[];
	hasImage?: boolean;
	headers: Header[];
	isSearchable?: boolean;
	model: string;
	orderBy: string;
	perPage?: number;
	searchByOptions?: {
		name: string;
		value: string;
	}[];
	url: string;
}

export const IndexControl = (props: Props) => {
	const notInitialRender = useRef(false);
	const [direction, setDirection] = useState<'asc' | 'desc'>(
		props.direction || 'asc'
	);
	const [hasError, setError] = useState<boolean>(false);
	const [filters, setFilters] = useState([]);
	const [hasResolved, setResolved] = useState<boolean>(false);
	const [index, setIndex] = useState<Paginator>();
	const [isBusy, setBusy] = useState(true);
	const [q, setQ] = useState<string>();
	const [page, setPage] = useState<number>(1);
	const [orderBy, setOrderBy] = useState(props.orderBy);
	const [searchBy, setSearchBy] = useState<string>();
	const [selectedFilters, setSelectedFilters] =
		useState<Record<string, never>>();

	const handleFilter = (field: string, value: string | number) => {
		if (selectedFilters) {
			const updatedFilters = { ...selectedFilters };
			updatedFilters[field] = value;
			setSelectedFilters(updatedFilters);
		}
	};

	const handleOrderChange = (value: string) => {
		if (orderBy === value) {
			setDirection(direction === 'asc' ? 'desc' : 'asc');
		} else {
			setOrderBy(value);
		}
	};

	const indexModels = () => {
		setBusy(true);
		const params: Params = {
			direction,
			filters,
			orderBy,
			page,
			perPage: props.perPage || 30,
			q,
		};

		// Only pass searchBy if contains a value.
		if (searchBy) {
			params.searchBy = searchBy;
		}

		const config = {
			params,
			paramsSerializer(params) {
				return Qs.stringify(params, { arrayFormat: 'indices' });
			},
		};

		vfAPI
			.get(props.url, config)
			.then((response) => {
				if (!response.data?.errors?.length) {
					setIndex(response.data[props.model]);
				}
			})
			.catch((error) => {
				console.error({ error });
				setError(true);
				toast.error(`An error occurred: ${error.message}`, {
					autoClose: false,
				});
				setIndex([]);
			})
			.finally(() => {
				setBusy(false);
				setResolved(true);
			});
	};

	useEffect(() => {
		if (notInitialRender.current || !props.filters) {
			indexModels();
		} else {
			notInitialRender.current = true;
		}
	}, [direction, filters, orderBy, page]);

	useEffect(() => {
		if (props.filters) {
			if (!selectedFilters) {
				const initialFilters = {};
				props.filters.forEach((filter) => {
					initialFilters[filter.field] = filter.options[0].value;
				});
				setSelectedFilters(initialFilters);
			} else {
				let updatedFilters = Object.entries(selectedFilters).map(
					(filter) => {
						const [field, term] = filter;
						/* Only return a filter if the term has a value. */
						return term ? { field, term } : null;
					}
				);
				/* Filter out any objects with null values. */
				updatedFilters = updatedFilters.filter((filter) => filter);
				setFilters(updatedFilters);
			}
		}
	}, [selectedFilters]);

	useEffect(() => {
		// Watch for the search query being reset.
		if (q === '') {
			indexModels();
		}
	}, [q]);

	if (!hasResolved) {
		return <Spinner />;
	}

	return (
		<>
			{!hasError && (
				<>
					{props.isSearchable && (
						<SearchControl
							value={q}
							placeholder={`Search ${props.model.replace(
								/_/g,
								' '
							)}`}
							onChange={setQ}
							handleSubmit={indexModels}
							isBusy={isBusy}
							searchByOptions={props.searchByOptions}
							searchBy={searchBy}
							onChangeSearchBy={setSearchBy}
						/>
					)}
					{props.filters && (
						<form>
							<fieldset disabled={isBusy}>
								{props.filters.map((filter) => (
									<>
										<SelectControl
											key={filter.label}
											label={filter.label}
											options={filter.options}
											onChange={(value) =>
												handleFilter(
													filter.field,
													value
												)
											}
										/>
									</>
								))}
							</fieldset>
						</form>
					)}
					{index && (
						<>
							<TableControl
								isFixed
								isIndex
								headers={props.headers}
								rows={index.data}
								orderBy={orderBy}
								direction={direction}
								handleOrderChange={handleOrderChange}
								hasImage={props.hasImage}
								isBusy={isBusy}
							/>
							<Flex
								justify={'end'}
								align={'center'}
								style={{ marginTop: '1rem' }}
							>
								{index.total > 0 && (
									<small className="displaying-num">
										{index.total.toLocaleString()} items
									</small>
								)}
								{index.last_page > 1 && (
									<>
										<Button
											isBusy={isBusy}
											disabled={page === 1}
											variant="secondary"
											icon={previous}
											onClick={() => setPage(1)}
										/>
										<Button
											isBusy={isBusy}
											disabled={page === 1}
											variant="secondary"
											icon={chevronLeft}
											onClick={() => setPage(page - 1)}
										/>
										<small className="tablenav-paging-text">
											{page.toLocaleString()} of{' '}
											{index.last_page.toLocaleString()}
										</small>
										<Button
											isBusy={isBusy}
											disabled={page === index.last_page}
											variant="secondary"
											icon={chevronRight}
											onClick={() => setPage(page + 1)}
										/>
										<Button
											isBusy={isBusy}
											disabled={page === index.last_page}
											variant="secondary"
											icon={next}
											onClick={() =>
												setPage(index.last_page)
											}
										/>
									</>
								)}
							</Flex>
						</>
					)}
				</>
			)}
		</>
	);
};
