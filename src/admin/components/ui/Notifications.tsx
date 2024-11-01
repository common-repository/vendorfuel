import React from '@wordpress/element';
import { NoticeList } from '@wordpress/components';
import { store as noticesStore } from '@wordpress/notices';
import { useSelect, useDispatch } from '@wordpress/data';

export const Notifications = () => {
	const notices = useSelect(
		(select) => select(noticesStore).getNotices(),
		[]
	);
	const { removeNotice } = useDispatch(noticesStore);

	return <NoticeList notices={notices} onRemove={removeNotice} />;
};
