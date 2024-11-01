import { Link, TextField as MUITextField } from '@mui/material';
import { Field } from './Field';

export class URLField extends Field {
	label: string;
	name: string;
	type: string;
	as = MUITextField;

	constructor(label: string, name?: string) {
		super(label, name);
		this.type = 'url';
		this.render = (value: string) => {
			return value ? <Link href={value}>{value}</Link> : <>&mdash;</>;
		};
	}
}
