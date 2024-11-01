export function localizedService() {
	const self = this;
	self.debugMode = localized.settings.general.debug;
	self.root = {
		url: localized.dir.url,
		path: localized.dir.root,
	};
	self.apiURL = localized.apiURL;
	self.api_key = localized.settings.general.api_key;
	self.wpRestUrl = localized.dir.wpRestUrl + 'vendorfuel';
	self.wpNonce = localized.nonce;
	self.plugin_data = localized.plugin_data;
	self.branding = localized.branding;
	self.settings = localized.settings;
	self.pages = localized.pages;
	self.notifications = [];

	self.ClearNotifications = function () {
		self.notifications.splice(0, self.notifications.length);
	};

	self.PushNotification = function (notification: { message: string }) {
		const msg = notification.message;

		if (
			msg &&
			typeof msg !== 'undefined' &&
			msg !== null &&
			msg !== '' &&
			msg !== 'OK'
		) {
			self.notifications.push(notification);
		}
	};

	self.GetNotifications = function () {
		return self.notifications;
	};

	self.RemoveNotification = function (index: number) {
		if (typeof self.notifications[index] !== 'undefined') {
			self.notifications.splice(index, 1);
		} else {
			self.notifications.push({
				type: 'danger',
				message: 'Whoops! Unable to remove notification.',
			});
		}
	};

	self.responseMessages = [];

	self.ClearResponseMsg = function () {
		self.responseMessages.splice(0, self.responseMessages.length);
	};

	self.PushResponseMsg = function (notification: { message: string }) {
		const msg = notification.message;

		if (
			msg &&
			typeof msg !== 'undefined' &&
			msg !== null &&
			msg !== '' &&
			msg !== 'OK'
		) {
			self.responseMessages.push(notification);
		}
	};

	self.GetResponseMsgs = function () {
		return self.responseMessages;
	};

	self.RemoveResponseMsg = function (index: number) {
		if (typeof self.responseMessages[index] !== 'undefined') {
			self.responseMessages.splice(index, 1);
		} else {
			self.responseMessages.push({
				type: 'danger',
				message: 'Whoops! Unable to remove notification.',
			});
		}
	};

	self.RemoveAllNoticfitcations = function () {
		if (typeof self.responseMessage !== 'undefined') {
			self.responseMessages = [];
		} else {
			self.responseMessages.push({
				type: 'danger',
				message: 'Whoops! Unable to remove notifications.',
			});
		}
	};
}
