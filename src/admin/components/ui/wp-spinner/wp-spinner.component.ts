export const WpSpinnerComponent = {
	bindings: {
		type: '@?',
	},
	template: `
		<ng-switch on="$ctrl.type">
			<div class="d-flex justify-content-center py-5"
				ng-switch-when="2x">
				<img src="/wp-admin/images/spinner-2x.gif" aria-hidden="true"/>
			</div>    
			<img src="/wp-admin/images/loading.gif" aria-hidden="true"
				ng-switch-when="loading"/>
			<div class="d-flex justify-content-center py-3" aria-hidden="true"
				ng-switch-default>
				<span class="spinner is-active" role="status"></span>
			</div>
		</ng-switch>
		`,
};
