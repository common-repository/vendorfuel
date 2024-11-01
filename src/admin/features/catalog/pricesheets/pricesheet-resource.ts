import { Resource } from '../../../shared/Resource';
import { Pricesheet } from './pricesheet';
import { PricesheetService } from './pricesheet-service';
import { Field } from '../../../shared/fields/Field';
import { IdField } from '../../../shared/fields/IdField';
import { TextField } from '../../../shared/fields/TextField';

export class PricesheetResource extends Resource {
	public static model = Pricesheet;
	public title = 'pricesheet';
	public static service = PricesheetService;

	public fields: Field[] = [
		new IdField('price_sheet_id'),
		new TextField('Name', 'sheet'),
		new TextField('Site ID'),
		new TextField('GP price sheet'),
	];
}
