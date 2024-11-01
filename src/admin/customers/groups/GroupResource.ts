import { renderGroup } from '../../shared/renderGroup';
import { Field } from '../../shared/fields/Field';
import { IdField } from '../../shared/fields/IdField';
import { BelongsToField } from '../../shared/fields/BelongsToField';
import { TextField } from '../../shared/fields/TextField';
import { Group } from './Group';
import { GroupService } from './GroupService';
import { Resource } from '../../shared/Resource';

export class GroupResource extends Resource {
	public static model = Group;
	public title = 'group';
	public static service = GroupService;

	public fields: Field[] = [
		new IdField('group_id'),
		new TextField('Name'),
		new BelongsToField('Parent group', 'parent_group', renderGroup),
		new TextField('Default price sheet ID', 'default_price_sheet'),
	];
}
