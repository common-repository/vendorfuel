import { renderThumbnail } from './renderThumbnail';

export const renderImage = (image: { thumb_url: string }) => {
	const thumbnail = image?.thumb_url ? image.thumb_url : null;
	return renderThumbnail(thumbnail);
};
