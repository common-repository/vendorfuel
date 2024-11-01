import { useEffect, useState } from '@wordpress/element';
import { Flex } from '@wordpress/components';
import { CategoryForm } from './CategoryForm';
import { isAnId } from '../../../utils/isAnId';
import breadcrumbBase from './breadcrumbs.json';
import { Breadcrumb } from '../../../shared/Breadcrumb';
import { Spinner } from '../../../components/spinner/Spinner';

export const CategoryEdit = () => {
	const [id, setId] = useState<number>();
	const [isNew, setNew] = useState<boolean>();
	const [hasResolved, setResolved] = useState<boolean>();
	const [breadcrumbs, setBreadcrumbs] = useState(breadcrumbBase);

	useEffect(() => {
		const fragment = location.hash.split('/').pop();
		if (isAnId(fragment)) {
			setId(Number(fragment));
			setResolved(true);
		} else {
			setNew(true);
			setBreadcrumbs([
				...breadcrumbBase,
				{
					label: 'Add new',
					href: '?page=vendorfuel#!/catalog/categories/create',
				},
			]);
			setResolved(true);
		}
	}, []);

	return (
		<>
			{hasResolved ? (
				<>
					<Breadcrumb breadcrumbs={breadcrumbs} />
					<h2>{isNew ? 'Add new' : 'Edit'} category</h2>
					<CategoryForm
						setBreadcrumbs={setBreadcrumbs}
						id={id}
						isNew={isNew}
					/>
				</>
			) : (
				<Spinner />
			)}
		</>
	);
};
