import { Resource } from '../../shared/Resource';
import { DocumentProfile } from './DocumentProfile';
import { DocumentProfileService } from './DocumentProfileService';
import { Field } from '../../shared/fields/Field';
import { IdField } from '../../shared/fields/IdField';
import { TextField } from '../../shared/fields/TextField';
import { BadgeField } from '../../shared/fields/BadgeField';

export class DocumentProfileResource extends Resource {
	public static model = DocumentProfile;
	public title = 'profile';
	public static service = DocumentProfileService;

	public fields: Field[] = [
		new IdField(),
		new TextField('Name'),
		new BadgeField('Format'),
	];
}
