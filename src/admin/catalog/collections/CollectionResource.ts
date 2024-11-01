import { Resource } from '../../shared/Resource';
import { Collection } from './Collection';
import { CollectionService } from './CollectionService';
import { Field } from '../../shared/fields/Field';
import { IdField } from '../../shared/fields/IdField';
import { ImageField } from '../../shared/fields/ImageField';
import { TextField } from '../../shared/fields/TextField';

export class CollectionResource extends Resource {
	public static model = Collection;
	public title = 'collection';
	public static service = CollectionService;

	public fields: Field[] = [
		new IdField(),
		new ImageField('img_url'),
		new TextField('Name'),
		new TextField('Description'),
	];
}
