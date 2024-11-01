export function telFilter() {
	return (tel: any) => {
		if (!tel) {
			return '';
		}
		const regex = '/^+/';
		const value = tel.toString().trim().replace(regex, '');
		if (value.match(/[^0-9]/)) {
			return tel;
		}

		let country, city, number;

		switch (value.length) {
			case 1:
			case 2:
			case 3:
				city = value;
				break;
			default:
				if (value.length === 11) {
					country = value.slice(0, 1);
					city = value.slice(1, 4);
					number = value.slice(4);
				} else {
					city = value.slice(0, 3);
					number = value.slice(3);
				}
		}
		if (number && value.length === 11) {
			number = number.slice(0, 3) + '-' + number.slice(3, 7);
			return (country + ' (' + city + ') ' + number).trim();
		} else if (number) {
			if (number.length > 3) {
				number = number.slice(0, 3) + '-' + number.slice(3, 7);
			}
			return ('(' + city + ') ' + number).trim();
		}

		return '(' + city;
	};
}
