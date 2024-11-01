export class Field {
	label: string;
	name: string;
	options: {
		sortable: boolean;
	};
	render?: (value: unknown) => JSX.Element;

	constructor(label: string, name?: string) {
		this.label = label;
		this.name = name || label.toLowerCase().replace(/\s/g, '_');
		this.options = {
			sortable: true,
		};
	}

	sortable(flag: boolean = true) {
		this.options.sortable = flag;
		return this;
	}
}
