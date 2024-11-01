import { Resource } from '../shared/Resource';
import { Report } from './Report';
import { ReportService } from './ReportService';
import { Field } from '../shared/fields/Field';
import { IdField } from '../shared/fields/IdField';
import { TextField } from '../shared/fields/TextField';
import { DateTimeField } from '../shared/fields/DateTimeField';
import { BadgeField } from '../shared/fields/BadgeField';

export class ReportResource extends Resource {
	public static model = Report;
	public title = 'report';
	public static service = ReportService;

	public fields: Field[] = [
		new IdField(),
		new TextField('Name'),
		new DateTimeField('Created', 'created_at'),
		new DateTimeField('Updated', 'updated_at'),
		new BadgeField('Frequency'),
	];
}
