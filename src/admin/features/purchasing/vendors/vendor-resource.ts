import { Resource } from '../../../shared/Resource';
import { Vendor } from './vendor';
import { VendorService } from './vendor-service';
import { Field } from '../../../shared/fields/Field';
import { IdField } from '../../../shared/fields/IdField';
import { TextField } from '../../../shared/fields/TextField';

export class VendorResource extends Resource {
	public static model = Vendor;
	public title = 'vendor';
	public static service = VendorService;

	public fields: Field[] = [
		new IdField(),
		new TextField('Name'),
		new TextField('Lead time'),
		new TextField('Location'),
	];
}
