import { Resource } from '../../shared/Resource';
import { Report } from './report';
import { ReportDownloadService } from './report-download-service';
import { Field } from '../../shared/fields/Field';
import { IdField } from '../../shared/fields/IdField';
import { TextField } from '../../shared/fields/TextField';
import { DateTimeField } from '../../shared/fields/DateTimeField';

export class ReportDownloadResource extends Resource {
	public static model = Report;
	public title = 'report-download';
	public static service = ReportDownloadService;

	static actions = [
		{
			name: 'Download',
			type: 'download',
			callback: ReportDownloadService.download,
		},
	];

	public fields: Field[] = [
		new IdField(),
		new TextField('Filename'),
		new DateTimeField('Created', 'created_at'),
		new DateTimeField('Processed', 'processed_on'),
		new DateTimeField('Updated', 'updated_at'),
	];
}
