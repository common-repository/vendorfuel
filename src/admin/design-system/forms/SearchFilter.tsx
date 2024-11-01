import React, { useState } from 'react';

export const SearchFilter = () => {
	const [searchBy, setSearchBy] = useState(null);

	const isActive = (a: unknown, b: unknown): string => {
		if (a === b) {
			return 'active';
		} else if (a && b && Object.keys(a)[0] === Object.keys(b)[0]) {
			return 'active';
		}
		return '';
	};

	const options = [
		null,
		{ id: 'ID' },
		{ group_id: 'Group ID' },
		{ other_field: 'Other field' },
	];

	return (
		<section>
			<h3>Search & Filters</h3>
			<p>
				Only the search bar is allowed to be full length. Each search
				box is to be inside an input group. No other appends or prepends
				are allowed besides the submit button and an optional selection
				dropdown.
			</p>
			<div className="input-group mb-3">
				<input
					type="text"
					className="form-control"
					placeholder="Search for ..."
				/>
				<button
					className="btn btn-outline-secondary"
					aria-label="Search"
				>
					<i className="bi bi-search" aria-hidden></i>
				</button>
			</div>
			<div className="input-group mb-3">
				<input
					type="text"
					className="form-control"
					placeholder={`Search${
						searchBy ? ` by ${Object.values(searchBy)[0]}` : ''
					} for ...`}
				/>
				<button
					className="btn btn-outline-secondary dropdown-toggle"
					type="button"
					data-bs-toggle="dropdown"
					aria-expanded="false"
				>
					{searchBy
						? `Searching by ${Object.values(searchBy)[0]}`
						: 'Search by'}
				</button>
				<div className="dropdown-menu">
					{options.map((option, i) => (
						<button
							className={`dropdown-item ${isActive(
								option,
								searchBy
							)}`}
							key={i}
							onClick={() => {
								setSearchBy(option);
							}}
						>
							{option ? Object.values(option)[0] : 'All'}
						</button>
					))}
				</div>
				<button
					className="btn btn-outline-secondary"
					aria-label="Search"
				>
					<i className="bi bi-search" aria-hidden></i>
				</button>
			</div>
			<p>Each filter box is to be inside an input group.</p>
			<div className="input-group mb-3">
				<span className="input-group-text">
					<i className="bi bi-filter" aria-hidden></i>
				</span>
				<input
					type="text"
					className="form-control"
					placeholder="Filter..."
				/>
			</div>
		</section>
	);
};
