export interface Notice {
	status: 'warning' | 'success' | 'error' | 'info';
	message: string;
}
