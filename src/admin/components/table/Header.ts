export interface Header {
	key?: string;
	label: string;
	type?: 'array' | 'badge' | 'boolean' | 'date';
	context?: { string: 'primary' | 'danger' | 'success' };
	disabled?: boolean;
	isBadge?: boolean;
	isBoolean?: boolean;
	isCurrency?: boolean;
	isDate?: boolean;
	isId?: boolean;
	isNumber?: boolean;
	isPrimary?: boolean;
	title?: string;
	value?: string;
}
