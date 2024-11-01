import { Field } from './Field';

export class DateTimeField extends Field {
	label: string;
	name: string;
	render: (value: string) => JSX.Element;

	constructor(label: string, name?: string) {
		super(label, name);
		this.render = (value) => {
			return value ? (
				<>
					{new Intl.DateTimeFormat('en-US', {
						dateStyle: 'short',
						timeStyle: 'short',
					}).format(new Date(value))}
				</>
			) : (
				<>&mdash;</>
			);
		};
	}
}
