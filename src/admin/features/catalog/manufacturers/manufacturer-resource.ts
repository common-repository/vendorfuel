import { Resource } from '../../../shared/Resource';
import { Manufacturer } from './manufacturer';
import { ManufacturerService } from './manufacturer-service';
import { Field } from '../../../shared/fields/Field';
import { IdField } from '../../../shared/fields/IdField';
import { TextField } from '../../../shared/fields/TextField';
import { URLField } from '../../../shared/fields/URLField';

export class ManufacturerResource extends Resource {
	public static model = Manufacturer;
	public title = 'manufacturer';
	public static service = ManufacturerService;

	public fields: Field[] = [
		new IdField(),
		new TextField('Name'),
		new TextField('Description', 'info'),
		new URLField('Website'),
	];
}
