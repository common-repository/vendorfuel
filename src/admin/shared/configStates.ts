import { highlightMenuItem } from './highlightMenuItem';
import { states } from './states';

export const configStates = (
	$stateProvider: ng.ui.IStateProvider,
	$urlRouterProvider: ng.ui.IUrlRouterProvider
) => {
	states.forEach((state: ng.ui.IState) => {
		const menuItemName = state.name?.split('.')[0];
		state.onEnter = () => {
			if (menuItemName) {
				highlightMenuItem(menuItemName);
			}
		};
		$stateProvider.state(state);
	});

	// Go to 404 state as fallback
	$stateProvider.state({
		name: '404',
		url: '/404',
		template: `
			<div class="alert alert-danger">
				<h2>Oops!</h2>
				<p>It looks like you tried to go to an area that doesn't exist anymore.</p>
				<p>Please use the navigation in the top menu.</p>
			</div>
		`,
	});

	$urlRouterProvider.otherwise('/404');
	//
};
