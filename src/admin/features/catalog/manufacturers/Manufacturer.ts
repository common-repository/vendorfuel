import * as Yup from 'yup';
import { TextareaField } from '../../../shared/fields/TextareaField';
import { TextField } from '../../../shared/fields/TextField';
import { URLField } from '../../../shared/fields/URLField';

export class Manufacturer {
	name: string;
	website?: string;
	info?: string;
	logo?: string | File;

	static fields = [
		new TextField('Name'),
		new TextareaField('Description', 'info'),
		new URLField('Website'),
	];

	static validationSchema = Yup.object().shape({
		name: Yup.string().min(3).max(250).required(),
	});

	constructor() {
		this.name = '';
	}
}
