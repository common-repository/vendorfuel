export class Parcel {
	title: string;
	length: number;
	width: number;
	height: number;
	distance_unit: 'in' | 'cm';

	constructor() {
		this.title = '';
		this.length = 0;
		this.width = 0;
		this.height = 0;
		this.distance_unit = 'in';
	}
}
