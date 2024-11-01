interface Props {
	handleSubmit: (e) => void;
	isBusy: boolean;
	q: string;
	setQ: any;
}

export const SearchBox = ({ handleSubmit, isBusy, q, setQ }: Props) => {
	return (
		<form onSubmit={handleSubmit}>
			<fieldset disabled={isBusy}>
				<div className="input-group mb-3">
					<input
						id="search-input"
						name="q"
						className="form-control"
						type="search"
						value={q}
						onChange={(event) => setQ(event.target.value)}
					/>
					<button
						disabled={isBusy}
						id="search-submit"
						className="btn btn-outline-primary"
						type="submit"
					>
						Search
					</button>
				</div>
			</fieldset>
		</form>
	);
};
