import template from './catalog-attributes-list-item.component.html';
declare const angular: ng.IAngularStatic;

/**
 * Catalog Attributes List Item Component
 *
 * @namespace Components
 */
( function() {
	'use strict';

	angular
		.module( 'vfApp' )
		.component( 'catalogAttributesListItem', {
			bindings: {
				attribute: '<',
				isInProgress: '<',
			},
			controller: AttributesListItemController,
			template,
		} );

	AttributesListItemController.$inject = [
		'$location',
		'$rootScope',
	];

	/**
	 * @namespace AttributesListItemController
	 * @param {Object} $location  AngularJS service.
	 * @param {Object} $rootScope AngularJS service.
	 * @memberof Components
	 */
	function AttributesListItemController(
		$location,
		$rootScope,
	) {
		const vm = this;
		vm.$onInit = onInit;
		vm.$onChanges = onChanges;
		vm.onClickApply = onClickApply;

		/**
		 */
		function onInit() {
			vm.isShowingValues =
				vm.attribute.values.some( ( element ) => element.isChecked );
		}

		/**
		 */
		function onChanges() {
			vm.isShowingValues =
				vm.attribute.values.some( ( element ) => element.isChecked );
		}

		/**
		 * @name onClickApply
		 * @param {Object} attribute Attribute
		 * @param {Object} form      AngularJS form object.
		 * @memberof Components.AttributeController
		 */
		function onClickApply( attribute, form ) {
			const { key } = attribute;
			const checkedAttributeValues =
				Object.values( attribute.values ).filter( ( element ) => element.isChecked );

			addAttrToSearchParams( key, checkedAttributeValues );
			$location.search( 'pg', null );
			$rootScope.$emit( 'catalog.params:changes' );
			form.$setPristine();

			/**
			 * @name addAttrToSearchParams
			 * @param {string} k      Attribute key name
			 * @param {Array}  values Attribute values
			 * @memberof Components.AttributeController.onClickApply
			 */
			function addAttrToSearchParams( k, values ) {
				const valueNames = values.map( ( element ) => element.value );
				const namespacedKey = `attr:${ k }`;
				$location.search( namespacedKey, valueNames );
			}
		}
	}
}() );
