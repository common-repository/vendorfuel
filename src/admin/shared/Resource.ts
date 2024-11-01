import { Field } from './fields/Field';
import { Service } from './Service';

/**
 * Abstract Resource class, based on Laravel Nova Resource class.
 */
export abstract class Resource {
	/**
	 * The model the resource corresponds to.
	 */
	public static model: any;

	/**
	 * The single value that should be used to represent the resource when being displayed (e.g. 'customer', 'product', 'user', etc.)
	 */
	public title: string;

	/**
	 * The API service the resource corresponds to.
	 */
	public static service: Service;

	/**
	 * The columns available as searchBy options. Most resources don't need this.
	 */
	public static search: { key: string; value: string }[] = [];

	/**
	 * Array of fields that will used for generating the form for creation and editing.
	 */
	public fields: Field[];

	/**
	 * @deprecated
	 */
	public static actions: {
		name: string;
		type: string;
		callback: any;
		disabled?: any;
	}[];
}
