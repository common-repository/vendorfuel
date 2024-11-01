import { Resource } from './Resource';
import { Upload } from './Upload';
import { Field } from './fields/Field';
import { IdField } from './fields/IdField';
import { TextField } from './fields/TextField';
import { BadgeField } from './fields/BadgeField';
import { DateTimeField } from './fields/DateTimeField';
import { NumberField } from './fields/NumberField';

export class UploadResource extends Resource {
	public static model = Upload;
	public title = 'upload';

	public fields: Field[] = [
		new IdField(),
		new TextField('Filename').sortable(false),
		new BadgeField('Status'),
		new NumberField('Total', 'total_records'),
		new NumberField('Processed', 'processed_records'),
		new DateTimeField('Uploaded', 'uploaded_at'),
		new DateTimeField('Started', 'started_at'),
		new DateTimeField('Completed', 'finished_at'),
	];
}
