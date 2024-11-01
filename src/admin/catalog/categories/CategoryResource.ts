import { Resource } from '../../shared/Resource';
import { Category } from './Category';
import { CategoryService } from './CategoryService';
import { Field } from '../../shared/fields/Field';
import { IdField } from '../../shared/fields/IdField';
import { ImageField } from '../../shared/fields/ImageField';
import { TextField } from '../../shared/fields/TextField';
import { BelongsToField } from '../../shared/fields/BelongsToField';
import { renderCategory } from '../../shared/renderCategory';

export class CategoryResource extends Resource {
	public static model = Category;
	public title = 'category';
	public static service = CategoryService;

	public fields: Field[] = [
		new IdField('cat_id'),
		new ImageField('img_url'),
		new TextField('Name', 'title'),
		new TextField('Description'),
		new BelongsToField(
			'Parent category',
			'parent_category',
			renderCategory
		),
	];
}
