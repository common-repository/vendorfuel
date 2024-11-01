import { TextField as MUITextField } from '@mui/material';
import { Field } from './Field';

export class TextareaField extends Field {
	label: string;
	name: string;
	type: string;
	as = MUITextField;
	multiline: boolean;

	constructor(label: string, name?: string) {
		super(label, name);
		this.type = 'text';
		this.multiline = true;
	}
}
