import { renderGroup } from '../../shared/renderGroup';
import { Customer } from '../Customer';
import { BadgeField } from '../../shared/fields/BadgeField';
import { Field } from '../../shared/fields/Field';
import { IdField } from '../../shared/fields/IdField';
import { BelongsToField } from '../../shared/fields/BelongsToField';
import { TextField } from '../../shared/fields/TextField';
import { CustomerService } from './CustomerService';
import { Resource } from '../../shared/Resource';

export class AccountResource extends Resource {
	public static model = Customer;
	public title = 'customer';
	public static service = CustomerService;

	public fields: Field[] = [
		new IdField(),
		new TextField('Name'),
		new TextField('Email'),
		new BelongsToField('Group', 'group', renderGroup),
		new BadgeField('Status'),
	];
}
