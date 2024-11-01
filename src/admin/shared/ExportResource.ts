import { Export } from './Export';
import { DateTimeField } from './fields/DateTimeField';
import { Field } from './fields/Field';
import { IdField } from './fields/IdField';
import { TextField } from './fields/TextField';
import { ProductService } from '../catalog/products/ProductService';
import { Resource } from './Resource';

export class ExportResource extends Resource {
	public static model = Export;
	public title = 'export';

	static actions = [
		{
			name: 'Download',
			type: 'download',
			callback: ProductService.download,
			disabled(item: Export) {
				return !item.finished_at;
			},
		},
	];

	public fields: Field[] = [
		new IdField().sortable(false),
		new TextField('Filename').sortable(false),
		new DateTimeField('Created', 'created_at').sortable(false),
		new DateTimeField('Updated', 'updated_at').sortable(false),
		new DateTimeField('Started', 'started_at').sortable(false),
		new DateTimeField('Completed', 'finished_at').sortable(false),
	];
}
