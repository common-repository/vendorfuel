import * as Yup from 'yup';
import { NumberField } from '../../shared/fields/NumberField';
import { TextField } from '../../shared/fields/TextField';

export class Vendor {
	name: string;
	lead_time: number;
	location: string;

	static id = 'vendor';

	static fields = [
		new TextField('Name'),
		new NumberField('Lead time'),
		new TextField('Location'),
	];

	static validationSchema = Yup.object().shape({
		name: Yup.string().min(3).max(250).required(),
		lead_time: Yup.number(),
		location: Yup.string().nullable(),
	});

	constructor() {
		this.name = '';
		this.lead_time = 0;
		this.location = '';
	}
}
