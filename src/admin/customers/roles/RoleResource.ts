import { Resource } from '../../shared/Resource';
import { Role } from './Role';
import { RoleService } from './RoleService';
import { Field } from '../../shared/fields/Field';
import { IdField } from '../../shared/fields/IdField';
import { TextField } from '../../shared/fields/TextField';

export class RoleResource extends Resource {
	public static model = Role;
	public title = 'role';
	public static service = RoleService;

	public fields: Field[] = [new IdField(), new TextField('Name')];
}
