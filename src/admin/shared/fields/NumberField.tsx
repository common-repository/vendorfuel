import { TextField as MUITextField } from '@mui/material';
import { Field } from './Field';

export class NumberField extends Field {
	label: string;
	name: string;
	type: string;
	as = MUITextField;

	constructor(label: string, name?: string) {
		super(label, name);
		this.type = 'number';
		this.render = (value: number) => {
			return value !== null ? (
				<>{value.toLocaleString()}</>
			) : (
				<>&mdash;</>
			);
		};
	}
}
