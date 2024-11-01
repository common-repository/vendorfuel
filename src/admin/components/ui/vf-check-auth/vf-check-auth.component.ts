export const VfCheckAuth: ng.IComponentOptions = {
	controller,
};

controller.$inject = ['Admin', 'Localized', 'Utils'];

function controller(Admin: any, Localized: any, Utils: any) {
	/**
	 * Initialization
	 */
	this.$onInit = () => {
		if (!Admin.Authed()) {
			if (Localized.api_key) {
				Utils.setLocation('/login', true);
			} else {
				Utils.setLocation('/settings', true);
			}
		}
	};
}
