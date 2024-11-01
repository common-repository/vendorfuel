export function alertsService() {
	/**
	 * Entire list of alerts.
	 */
	this.list = [];

	/**
	 * Add an alert to the list of alerts.
	 *
	 * @param {Object} options
	 * @param {string} options.type
	 * @param {string} options.msg
	 */
	this.add = (options: { type: string; msg: string }) => {
		if (!angular.isObject(options)) {
			options = {
				type: 'warning',
				msg: options,
			};
		}
		this.list.push(options);
	};

	/**
	 * Add error message to list.
	 *
	 * @param {string} msg
	 */
	this.error = (msg: string) => {
		this.list.push({
			type: 'danger',
			msg,
		});
	};

	/**
	 * Add warning message to list.
	 *
	 * @param {string} msg
	 */
	this.warning = (msg: string) => {
		this.list.push({
			type: 'warning',
			msg,
		});
	};

	/**
	 * Add info message to list.
	 *
	 * @param {string} msg
	 */
	this.info = (msg: string) => {
		this.list.push({
			type: 'info',
			msg,
		});
	};

	/**
	 * Default action: Add success message to list.
	 *
	 * @param {string} msg
	 */
	this.message = (msg: string) => {
		this.info(msg);
	};

	/**
	 * Add success message to list.
	 *
	 * @param {string} msg
	 */
	this.success = (msg: string) => {
		this.list.push({
			type: 'success',
			msg,
		});
	};

	/**
	 * Remove message from list.
	 *
	 * @param {number} index
	 */
	this.remove = (index: number) => {
		this.list.splice(index, 1);
	};
}
