import React, { useEffect, useState } from '@wordpress/element';
import { Notice } from '@wordpress/components';
import type { Notice as INotice } from './Notice';

interface Props {
	notices: INotice[];
}

export const Notices = ({ notices }: Props) => {
	const [myNotices, setNotices] = useState<Array<INotice>>([]);

	const handleRemove = (index: number) => {
		const updatedNotices = [...notices];
		updatedNotices.splice(index, 1);
		setNotices(updatedNotices);
	};

	useEffect(() => {
		setNotices(notices);
	}, [notices]);

	return (
		<>
			{myNotices.map((notice: INotice, index: number) => (
				<Notice
					className="mx-0 mb-3"
					key={index}
					status={notice.status}
					onRemove={() => handleRemove(index)}
				>
					{notice.message}
				</Notice>
			))}
		</>
	);
};
