declare const angular: ng.IAngularStatic;

import { highlightMenuItem } from '../../utils/highlightMenuItem';

const states: Array<ng.ui.IState> = [ {
	name: 'settings',
	url: '/settings',
	component: 'settingsPage',
} ];

export const SettingsRoutingModule = angular
	.module( 'SettingsRoutingModule', [] )
	.config( (
		$stateProvider: ng.ui.IStateProvider,
	) => {
		'ngInject';

		states.forEach( ( state ) => {
			state.onEnter = () => {
				highlightMenuItem( 'settings' );
			};
			$stateProvider.state( state );
		} );
	} )
	.name;
