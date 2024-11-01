import { Field } from './Field';

export class BelongsToField extends Field {
	label: string;
	name: string;
	render: (value: unknown) => JSX.Element;

	constructor(
		label: string,
		name: string,
		render: (value: unknown) => JSX.Element
	) {
		super(label, name);
		this.options.sortable = false;
		this.render = render;
	}
}
