import type { Header } from './Header';
/* eslint-disable jsx-a11y/anchor-is-valid */
interface Props {
	direction: 'asc' | 'desc';
	header: Header;
	isBusy?: boolean;
	orderBy: string;
	handleOrderChange: (key: string) => void;
}

export const SortableHeader = ({
	direction,
	header,
	orderBy,
	isBusy,
	handleOrderChange,
}: Props) => {
	const handleClick = (e) => {
		e.preventDefault();
		if (!isBusy) {
			handleOrderChange(header.value);
		}
	};

	const width = () => {
		if (header.isPrimary) {
			return '50%';
		}
		return header.isId ? '10ch' : '25%';
	};

	const sortClass = () => {
		if (!header.disabled) {
			return orderBy === header.value ? 'sorted' : 'sortable';
		}
	};

	return (
		<th
			className={`manage-column ${
				header.isPrimary ? 'column-primary' : ''
			} ${sortClass()} ${direction}`}
			style={{ width: width() }}
		>
			{header.disabled ? (
				<>{header.label}</>
			) : (
				<a
					className="hstack d-flex align-items-center text-decoration-none"
					href="#"
					onClick={handleClick}
					title={`Sort by ${
						header.title
							? header.title.toLowerCase()
							: header.label.toLowerCase()
					}`}
				>
					<span>{header.label}</span>
					<span className="sorting-indicator"></span>
				</a>
			)}
		</th>
	);
};
