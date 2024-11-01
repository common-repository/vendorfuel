import { renderThumbnail } from '../renderThumbnail';
import { Field } from './Field';

export class ImageField extends Field {
	name: string;
	render: (image: { thumb_url: string }) => JSX.Element;

	constructor(name: string) {
		super('Image', name);
		this.options.sortable = false;
		this.render = (image) => {
			let thumbnail = '';
			if (image) {
				thumbnail = image.thumb_url ? image.thumb_url : image;
			}
			return renderThumbnail(thumbnail);
		};
	}
}
