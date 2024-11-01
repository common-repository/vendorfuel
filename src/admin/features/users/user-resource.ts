import { Resource } from '../../shared/Resource';
import { User } from './user';
import { UserService } from './user-service';
import { Field } from '../../shared/fields/Field';
import { IdField } from '../../shared/fields/IdField';
import { TextField } from '../../shared/fields/TextField';

export class UserResource extends Resource {
	public static model = User;
	public title = 'user';
	public static service = UserService;

	public fields: Field[] = [
		new IdField(),
		new TextField('Name'),
		new TextField('Email'),
	];
}
