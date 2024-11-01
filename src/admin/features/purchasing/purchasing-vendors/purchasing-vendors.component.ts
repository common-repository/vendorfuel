import template from './purchasing-vendors.component.html';

export const PurchasingVendorsComponent: ng.IComponentOptions = {
	template,
	controller: PurchasingVendorsController,
};

PurchasingVendorsController.$inject = [
	'$scope',
	'$state',
	'$stateParams',
	'Admin',
	'ConfirmModal',
	'Settings',
	'Debug',
	'Utils',
	'Localized',
];

function PurchasingVendorsController(
	$scope: any,
	$state: ng.ui.IStateParamsService,
	$stateParams: ng.ui.IStateParamsService,
	Admin: any,
	ConfirmModal: any,
	Settings: any,
	Debug: any,
	Utils: any,
	Localized: any,
) {
	this.breadcrumbs = [
		{ name: 'Purchasing', state: 'purchasing.page' },
		{ name: 'Vendors', state: 'purchasing-vendors' },
	];

	/**
	 * Sets the active tab based on whether it matches a index of accessible tabs.
	 *
	 * @param {number} tab
	 * @return {number | Object} Sets activeTab to the tab number, or reloads the state to reset the activeTab.
	 */
	const setActiveTab = ( tab: number ) => {
		const index = [ 0, 1 ];
		if ( index.includes( tab ) ) {
			return $scope.activeTab = tab;
		}
		return $state.go( $state.current, { activeTab: 0 }, { reload: true } );
	};

	setActiveTab( parseInt( $stateParams.activeTab ) );
	$scope.addParams = {};
	$scope.admin = Admin;
	$scope.confirm = ConfirmModal;
	$scope.loading = false;
	$scope.loadingMore = false;
	$scope.localized = Localized;
	$scope.rppValues = [ 15, 30, 50, 100 ];
	$scope.saved = false;
	$scope.saving = false;
	$scope.searchParams = {
		q: '',
		sortBy: '',
		sortType: 'asc',
		rpp: $scope.rppValues[ 0 ],
	};
	$scope.settings = Settings;
	$scope.utils = Utils;
	$scope.vendor = {};
	$scope.vendors = [];
	$scope.vendorsEndpoint = localized.apiURL + '/admin/purchasing/vendor/';

	//FUNCTIONS
	this.selectVendor = ( id: number ) => {
		$scope.vendor.id = id;
		$scope.activeTab = 2;
	};

	$scope.LoginCallback = function() {
		$scope.loading = true;
		$scope.init();
	};

	$scope.SortIndex = function( sortBy: string ) {
		$scope.sortAscending = ( $scope.searchParams.sortBy === sortBy ) ? ! $scope.sortAscending : true;
		$scope.searchParams.sortBy = sortBy;
		$scope.searchParams.sortType = $scope.sortAscending ? 'asc' : 'desc';
		$scope.Index( $scope.searchParams.page );
	};

	$scope.TabChanged = function( i: number ) {
		$scope.activeTab = i;

		switch ( $scope.activeTab ) {
			case 0:
				if ( ! $scope.vendors.data ) {
					$scope.Index();
				}
				break;
			case 2:
				if ( $scope.vendor.id ) {
					$scope.Show( $scope.vendor.id );
				}
				break;
		}
	};

	//RESTful Functions
	//Index
	$scope.Index = function( page: number ) {
		$scope.loadingMore = true;
		$scope.searchParams.page = page || 1;
		const req = {
			method: 'GET',
			url: $scope.vendorsEndpoint,
			params: $scope.searchParams,
		};
		Utils.getHttpPromise( req ).then( function( resp: any ) {
			$scope.vendors = resp.vendors;
		}, function( errResp: Error ) {
			Debug.log( errResp );
		} ).finally( function() {
			$scope.loadingMore = false;
			$scope.loading = false;
		} );
	};

	//Show
	$scope.Show = function( id: number ) {
		$scope.loading = true;
		$scope.vendor.id = id;
		const req = {
			method: 'GET',
			url: $scope.vendorsEndpoint + id,
		};
		Utils.getHttpPromise( req ).then( function( resp: any ) {
			$scope.vendor = resp.vendor;
		}, function( errResp: Error ) {
			Debug.log( errResp );
		} ).finally( function() {
			$scope.loading = false;
		} );
	};

	//Store
	$scope.Store = function() {
		$scope.loading = true;
		const req = {
			method: 'POST',
			url: $scope.vendorsEndpoint,
			data: $scope.addParams,
		};
		Utils.getHttpPromise( req ).then( function( resp: any ) {
			if ( ! resp.errors.length ) {
				$scope.addParams = {};
				$scope.Show( resp.vendor.id );
				$scope.TabChanged( 2 );
			}
		}, function( errResp: Error ) {
			Debug.log( errResp );
		} ).finally( function() {
			$scope.loading = false;
		} );
	};

	//Update
	$scope.Update = function( id: number ) {
		$scope.loading = true;
		const req = {
			method: 'PUT',
			url: $scope.vendorsEndpoint + id,
			data: $scope.vendor,
		};
		Utils.getHttpPromise( req ).then( function() {

		}, function( errResp: Error ) {
			Debug.log( errResp );
		} ).finally( function() {
			$scope.loading = false;
		} );
	};

	//Delete
	$scope.Delete = function( id: number ) {
		const callback = {
			confirm() {
				$scope.loading = true;
				const req = {
					method: 'DELETE',
					url: $scope.vendorsEndpoint + id,
				};
				Utils.getHttpPromise( req ).then( function() {
					$scope.vendor = {};
					$scope.activeTab = 0;
					$scope.Index();
				}, function( errResp: Error ) {
					Debug.log( errResp );
				} ).finally( function() {
					$scope.loading = false;
				} );
			},
			cancel() { },
		};
		$scope.confirm.Show( callback, 'Delete Vendor?', 'All related cost sheets to this vendor will also be deleted. This action cannot be undone.', 'Back', 'DELETE' );
	};
}
