import { Resource } from '../../shared/Resource';
import { Product } from './Product';
import { ProductService } from './ProductService';
import { renderCategory } from '../../shared/renderCategory';
import { Field } from '../../shared/fields/Field';
import { IdField } from '../../shared/fields/IdField';
import { ImageField } from '../../shared/fields/ImageField';
import { TextField } from '../../shared/fields/TextField';
import { NumberField } from '../../shared/fields/NumberField';
import { BelongsToField } from '../../shared/fields/BelongsToField';
import { BadgeField } from '../../shared/fields/BadgeField';

export class ProductResource extends Resource {
	public static model = Product;
	public title = 'product';
	public static service = ProductService;

	public fields: Field[] = [
		new IdField('product_id'),
		new ImageField('image'),
		new TextField('Name', 'description'),
		new TextField('SKU'),
		new NumberField('QTY'),
		new BelongsToField('Category', 'category', renderCategory),
		new BadgeField('Status'),
	];
}
