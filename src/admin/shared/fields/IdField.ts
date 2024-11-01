import { Field } from './Field';

export class IdField extends Field {
	name: string;

	constructor(name: string = 'id') {
		super('ID', name);
	}
}
