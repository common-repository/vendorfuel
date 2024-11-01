import { Button, Flex } from '@wordpress/components';

import { chevronLeft, chevronRight, next, previous } from '@wordpress/icons';
import PropTypes from 'prop-types';

export const TablePagination = ({ paginator, handleChange, isBusy }) => {
	return (
		<Flex justify={'end'} align={'center'} expanded={false}>
			{paginator.total > 0 && (
				<small className="displaying-num">
					{paginator.total.toLocaleString()} item
					{paginator.total > 1 ? 's' : ''}
				</small>
			)}
			{paginator.last_page > 1 && (
				<>
					<Button
						isBusy={isBusy}
						disabled={paginator.current_page === 1}
						variant="secondary"
						icon={previous}
						onClick={() => handleChange(1)}
					/>
					<Button
						isBusy={isBusy}
						disabled={paginator.current_page === 1}
						variant="secondary"
						icon={chevronLeft}
						onClick={() => handleChange(paginator.current_page - 1)}
					/>
					<small className="tablenav-paging-text">
						{paginator.current_page.toLocaleString()} of{' '}
						{paginator.last_page.toLocaleString()}
					</small>
					<Button
						isBusy={isBusy}
						disabled={
							paginator.current_page === paginator.last_page
						}
						variant="secondary"
						icon={chevronRight}
						onClick={() => handleChange(paginator.current_page + 1)}
					/>
					<Button
						isBusy={isBusy}
						disabled={
							paginator.current_page === paginator.last_page
						}
						variant="secondary"
						icon={next}
						onClick={() => handleChange(paginator.last_page)}
					/>
				</>
			)}
		</Flex>
	);
};

TablePagination.propTypes = {
	handleChange: PropTypes.func,
	isBusy: PropTypes.bool,
	paginator: PropTypes.object,
};
