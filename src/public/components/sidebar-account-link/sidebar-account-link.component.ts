import template from './sidebar-account-link.component.html';

export const SidebarAccountLinkComponent: ng.IComponentOptions = {
	template,
	controller: SidebarAccountController,
};

SidebarAccountController.$inject = ['User', 'Utils'];

function SidebarAccountController(User, Utils) {
	const vm = this;
	vm.$onInit = $onInit;

	/**
	 * Initialization.
	 */
	function $onInit() {
		vm.isSignedIn = User.isAuthed && User.email;
		vm.link = vm.isSignedIn
			? Utils.getPageUrl('account')
			: Utils.getPageUrl('login');
		vm.greeting = vm.isSignedIn
			? `Hello ${getFirstName(User.name)}`
			: 'Sign in';
	}

	/**
	 * @param {string} name User name.
	 * @return {string} First name or name if there's no space.
	 */
	function getFirstName(name) {
		const space = ' ';
		if (name.includes(space)) {
			return name.substr(0, name.indexOf(space));
		}
		return name;
	}
}
