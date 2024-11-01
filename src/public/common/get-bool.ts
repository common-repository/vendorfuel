export function getBool(val: string | number) {
	switch (val) {
		case 'true':
		case '1':
		case 1:
			return true;
		default:
			return false;
	}
}
