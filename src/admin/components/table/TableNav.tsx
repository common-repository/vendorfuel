import { Button } from '@wordpress/components';

interface Props {
	currentPage: number;
	isBusy: boolean;
	lastPage: number;
	setPage: (page: number) => void;
	total: number;
}

export const TableNav = (props: Props) => {
	const { currentPage, isBusy, lastPage, setPage, total } = props;

	return (
		<div className="hstack justify-content-end gap-1 mt-3">
			<small className="me-2">
				{total} item{total !== 1 ? 's' : ''}
			</small>
			{lastPage > 1 && (
				<>
					<Button
						disabled={currentPage === 1}
						isBusy={isBusy}
						variant="secondary"
						onClick={() => setPage(1)}
					>
						&laquo; First
					</Button>
					<Button
						disabled={currentPage === 1}
						isBusy={isBusy}
						variant="secondary"
						onClick={() => setPage(currentPage - 1)}
					>
						&lsaquo; Previous
					</Button>
					<Button
						disabled={currentPage === lastPage}
						isBusy={isBusy}
						variant="secondary"
						onClick={() => setPage(currentPage + 1)}
					>
						Next &rsaquo;
					</Button>
					<Button
						disabled={currentPage === lastPage}
						isBusy={isBusy}
						variant="secondary"
						onClick={() => setPage(lastPage)}
					>
						Last &raquo;
					</Button>
				</>
			)}
		</div>
	);
};
