import template from './favorites.component.html';

export const FavoritesPage: ng.IComponentOptions = {
	controller,
	template,
};

controller.$inject = ['$location', 'User', 'Utils'];

/**
 * @param {Object} $location
 * @param {Object} User      VendorFuel service
 * @param {Object} Utils     VendorFuel service
 */
function controller($location, User, Utils) {
	const vm = this;
	vm.isSignedIn = User.isAuthed && User.email;
	vm.pageUrls = {
		login: Utils.getPageUrl('login', { redirect_to: $location.path() }),
		register: Utils.getPageUrl('register'),
	};
}
