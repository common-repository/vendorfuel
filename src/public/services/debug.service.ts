/* eslint-disable no-console */
export function debugService() {
	const self = this;
	const debugMode = localized.settings.general.debug;

	self.log = function (lA: any, lB: any, lC: any, lD: any) {
		if (debugMode) {
			if (lA && lB && lC && lD) {
				console.log(lA, lB, lC, lD);
			} else if (lA && lB && lC) {
				console.log(lA, lB, lC);
			} else if (lA && lB) {
				console.log(lA, lB);
			} else if (lA) {
				console.log(lA);
			}
		}
	};

	this.warn = (msg: any) => {
		if (debugMode) {
			console.warn(msg);
		}
	};
}
