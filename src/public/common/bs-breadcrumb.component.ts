(function () {
	'use strict';

	const template = `
		<nav aria-label="breadcrumb">
			<ol class="breadcrumb p-2 bg-light rounded">
				<li aria-current="page"
					ng-repeat="item in $ctrl.breadcrumb track by $index"
					ng-class="['breadcrumb-item', { 'active':$last }]">
					<a ng-if="!$last" ng-href="{{ item.link }}">
						{{ item.title }}
					</a>
					<span ng-if="$last">
						{{ item.title }}
					</span>
				</li>
			</ol>
		</nav>
	`;

	angular.module('vfApp').component('bsBreadcrumb', {
		bindings: {
			breadcrumb: '<',
		},
		template,
	});
})();
