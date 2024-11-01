import React, { useEffect, useState } from 'react';
import { vfAPI } from '../../../lib/vfAPI';
import { SearchBox } from '../../../components/ui/SearchBox';
import { TableNav } from '../../../components/table/TableNav';
import { ListTable } from '../../../components/table/ListTable';
import type { Params } from '../../../types';
import { apiURL } from '../../../data/apiURL';
import { Spinner } from '../../../../../resources/js/Shared/Spinner';

export const RolesIndex = () => {
	const [isBusy, setIsBusy] = useState<boolean>(false);
	const [page, setPage] = useState<number>(1);
	const [q, setQ] = useState<string>('');
	const [roles, setRoles] = useState();
	const [sortBy, setSortBy] = useState<string>('id');
	const [sortType, setSortType] = useState<'asc' | 'desc'>('asc');

	const headers = [
		{ key: 'id', label: 'ID' },
		{ key: 'name', label: 'Name' },
		{ key: 'registration', label: 'Registration', type: 'boolean' },
		{
			key: 'allowed_email_domains',
			label: 'Allowed Email Domains',
			type: 'array',
		},
	];

	const deleteRole = (id: number) => {
		setIsBusy(true);
		vfAPI.delete(`/customer/roles/${id}`).then((response) => {
			if (!response.data.errors.length) {
				getRoles();
			}
		});
	};

	const editRole = (id: number) => {
		const url = `${location.href}/${id}`;
		location.assign(url);
	};

	const getRoles = (params: Params = {}) => {
		setIsBusy(true);
		const url = apiURL.ROLES;
		const config = {
			params,
		};
		vfAPI.get(url, config).then((response) => {
			setRoles(response.data.roles);
			setIsBusy(false);
		});
	};

	const handleSubmit = (e: Event) => {
		e.preventDefault();
		const params = {
			page: 1,
			q,
			sortBy,
			sortType,
		};
		getRoles(params);
	};

	useEffect(() => {
		const params = {
			page,
			q,
			sortBy,
			sortType,
		};
		getRoles(params);
	}, [page, sortBy, sortType]);

	return (
		<>
			<SearchBox
				isBusy={isBusy}
				handleSubmit={handleSubmit}
				q={q}
				setQ={setQ}
			/>
			{!roles && <Spinner />}
			{roles && (
				<ListTable
					deleteItem={deleteRole}
					editItem={editRole}
					headers={headers}
					isBusy={isBusy}
					rows={roles.data}
					sortBy={sortBy}
					setSortBy={setSortBy}
					sortType={sortType}
					setSortType={setSortType}
				/>
			)}
			{roles && (
				<TableNav
					isBusy={isBusy}
					currentPage={roles.current_page}
					setPage={setPage}
					lastPage={roles.last_page}
					total={roles.total}
				/>
			)}
		</>
	);
};
