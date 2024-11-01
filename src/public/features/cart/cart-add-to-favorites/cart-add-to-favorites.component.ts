import template from './cart-add-to-favorites.component.html';

export const CartAddToFavorites: ng.IComponentOptions = {
	bindings: {
		isFavorite: '<',
		productId: '<',
	},
	controller,
	template,
};

controller.$inject = ['Favorites', 'User'];

function controller(Favorites, User) {
	const vm = this;
	vm.isInProgress = false;
	vm.isLoggedIn = User.isAuthed && !User.isGuest;
	vm.toggleFavorite = toggleFavorite;

	function toggleFavorite(productId: number) {
		vm.isInProgress = true;
		if (vm.isFavorite) {
			Favorites.remove(productId).then(function () {
				vm.isFavorite = false;
				vm.isInProgress = false;
			});
		} else {
			Favorites.add(productId).then(function () {
				vm.isFavorite = true;
				vm.isInProgress = false;
			});
		}
	}
}
