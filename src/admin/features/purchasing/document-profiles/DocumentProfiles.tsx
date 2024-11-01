import React, { useEffect, useState } from 'react';
import { vfAPI } from '../../../lib/vfAPI';
import { SearchBox } from '../../../components/ui/SearchBox';
import { TableNav } from '../../../components/table/TableNav';
import { ListTable } from '../../../components/table/ListTable';
import type { Params } from '../../../types';
import { Spinner } from '../../../../../resources/js/Shared/Spinner';

const apiUrl = '/purchasing/document-profile/';
const headers = [
	{ key: 'id', label: 'ID' },
	{ key: 'name', label: 'Name' },
	{ key: 'doc_format', label: 'Format' },
];

export const DocumentProfiles = () => {
	const [isBusy, setIsBusy] = useState<boolean>(false);
	const [page, setPage] = useState<number>(1);
	const [q, setQ] = useState<string>('');
	const [profiles, setProfiles] = useState();
	const [sortBy, setSortBy] = useState<string>('id');
	const [sortType, setSortType] = useState<'asc' | 'desc'>('asc');

	const deleteProfile = (id: number) => {
		setIsBusy(true);
		vfAPI.delete(`${apiUrl}${id}`).then((response) => {
			if (!response.data.errors.length) {
				getProfiles();
			}
		});
	};

	const editProfile = (id: number) => {
		const url = `${location.href}/${id}`;
		location.assign(url);
	};

	const getProfiles = (params: Params = {}) => {
		setIsBusy(true);
		const config = {
			params,
		};
		vfAPI.get(apiUrl, config).then((response) => {
			setProfiles(response.data.document_profiles);
			setIsBusy(false);
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const params = {
			page: 1,
			q,
			sortBy,
			sortType,
		};
		getProfiles(params);
	};

	useEffect(() => {
		const params = {
			page,
			q,
			sortBy,
			sortType,
		};
		getProfiles(params);
	}, [page, sortBy, sortType]);

	return (
		<>
			<SearchBox
				isBusy={isBusy}
				handleSubmit={handleSubmit}
				q={q}
				setQ={setQ}
			/>
			{!profiles && <Spinner />}
			{profiles && (
				<ListTable
					deleteItem={deleteProfile}
					editItem={editProfile}
					headers={headers}
					isBusy={isBusy}
					rows={profiles.data}
					sortBy={sortBy}
					setSortBy={setSortBy}
					sortType={sortType}
					setSortType={setSortType}
				/>
			)}
			{profiles && (
				<TableNav
					isBusy={isBusy}
					currentPage={profiles.current_page}
					setPage={setPage}
					lastPage={profiles.last_page}
					total={profiles.total}
				/>
			)}
		</>
	);
};
