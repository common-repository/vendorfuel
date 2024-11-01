/* eslint-disable jsx-a11y/anchor-is-valid */
import { Icon } from '@wordpress/components';

interface Props {
	changeSort: (key: string) => void;
	orderBy: string;
	direction: 'asc' | 'desc';
	label: string;
	id: string;
}

export const SortableTableHeader = ({
	changeSort,
	orderBy,
	direction,
	label,
	id,
}: Props) => {
	const handleClick = (e) => {
		e.preventDefault();
		changeSort(id);
	};

	return (
		<th
			className={`${orderBy === id ? 'sorted' : 'sortable'} ${direction}`}
		>
			<a href="#" onClick={handleClick}>
				<span>{label}</span>
				{orderBy === id && (
					<Icon
						icon={direction === 'asc' ? 'arrow-up' : 'arrow-down'}
					/>
				)}
			</a>
		</th>
	);
};
