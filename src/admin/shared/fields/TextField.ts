import { TextField as MUITextField } from '@mui/material';
import { Field } from './Field';

export class TextField extends Field {
	label: string;
	name: string;
	type: string;
	as = MUITextField;

	constructor(label: string, name?: string) {
		super(label, name);
		this.type = 'text';
	}
}
