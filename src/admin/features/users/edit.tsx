import { useEffect, useState } from '@wordpress/element';
import { Breadcrumb } from '../../shared/Breadcrumb';
import { isAnId } from '../../utils/isAnId';
import { AdminUserForm } from './AdminUserForm';

export const AdminAccountEdit = () => {
	const [id, setId] = useState<number>();
	const [isNew, setNew] = useState<boolean>();
	const [breadcrumbs, setBreadcrumbs] = useState([
		{ label: 'Admin users', href: '?page=vf-users' },
	]);

	useEffect(() => {
		const fragment = location.hash.split('/').pop();
		if (isAnId(fragment)) {
			setId(Number(fragment));
		} else {
			setNew(true);
		}
	}, []);

	return (
		<>
			<Breadcrumb breadcrumbs={breadcrumbs} />
			<AdminUserForm
				setBreadcrumbs={setBreadcrumbs}
				id={id}
				isNew={isNew}
			/>
		</>
	);
};
