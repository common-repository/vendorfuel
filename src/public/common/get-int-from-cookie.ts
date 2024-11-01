export function getIntFromCookie(cookie: string) {
	let ret = parseInt(cookie);
	if (isNaN(ret)) {
		ret = 0;
	}
	return ret;
}
