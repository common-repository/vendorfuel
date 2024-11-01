import { renderBadge } from '../renderBadge';
import { Field } from './Field';

export class BadgeField extends Field {
	label: string;
	name: string;

	constructor(label: string, name?: string) {
		super(label, name);
		this.render = renderBadge;
	}
}
