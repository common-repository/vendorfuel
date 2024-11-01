declare const angular: ng.IAngularStatic;

const states: Array<ng.ui.IState> = [ {
	name: 'tutorial',
	url: '/tutorial',
	component: 'vfTutorial',
	params: {
		activeTab: {
			dynamic: true,
		},
	},
} ];

export const TutorialRoutingModule = angular
	.module( 'TutorialRoutingModule', [] )
	.config( (
		$stateProvider: ng.ui.IStateProvider,
	) => {
		'ngInject';

		states.forEach( ( state ) => {
			$stateProvider.state( state );
		} );
	} )
	.name;
