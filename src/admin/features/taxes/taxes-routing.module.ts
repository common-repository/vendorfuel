declare const angular: ng.IAngularStatic;
import { highlightMenuItem } from '../../utils/highlightMenuItem';

const states: Array<ng.ui.IState> = [
	{
		name: 'taxes',
		url: '/taxes',
		component: 'taxesPage',
	},

];

export const TaxesRoutingModule = angular
	.module( 'TaxesRoutingModule', [] )
	.config( (
		$stateProvider: ng.ui.IStateProvider,
	) => {
		'ngInject';

		states.forEach( ( state ) => {
			state.onEnter = () => {
				highlightMenuItem( 'taxes' );
			};
			$stateProvider.state( state );
		} );
	} )
	.name;
