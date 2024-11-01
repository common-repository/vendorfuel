export interface Link {
	active?: boolean;
	label: string;
	to?: string;
	href?: string;
	onClick?: () => void;
}
