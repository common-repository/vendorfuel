import template from './admin-accounts-index.component.html';

export const AdminAccountsIndex: ng.IComponentOptions = {
	template,
	controller,
};

controller.$inject = [
	'$scope',
	'Admin',
	'AlertModal',
	'ConfirmModal',
	'Settings',
	'Debug',
	'Utils',
	'Localized',
];

function controller(
	$scope: any,
	Admin: any,
	AlertModal: any,
	ConfirmModal: any,
	Settings: any,
	Debug: any,
	Utils: any,
) {
	this.$onInit = () => {
		this.breadcrumbs = [
			{ name: 'Admin Accounts', state: 'admin' },
		];

		$scope.activeTab = 0;
		$scope.adminAccountsEndpoint = localized.apiURL + '/admin/user/';
		$scope.editName = false;
		$scope.isAuthed = Admin.Authed();
		$scope.loading = false;
		$scope.loadingMore = false;
		$scope.newAdmin = {};
		$scope.newAdmin.roles = {};
		$scope.rppValues = [ 15, 30, 50, 100 ];
		$scope.saved = false;
		$scope.saving = false;
		$scope.searchParams = {
			page: 1,
			rpp: $scope.rppValues[ 0 ],
		};
		$scope.searchTerm = '';
		$scope.selectedAccount = null;
		$scope.showPassword = false;
		$scope.showPasswordConf = false;

		if ( $scope.activeTab === null ) {
			$scope.activeTab = 0;
		}
	};

	//FUNCTIONS
	$scope.LoginCallback = function() {
		$scope.loading = true;
		//logged in, do something. i.e. make api calls to load current tab's data
	};

	/**
	 * Handles tab initialization
	 *
	 * @param {number} i Index
	 */
	$scope.TabChanged = function( i: number ) {
		$scope.activeTab = i;
		Settings.errors = {};
		$scope.loading = true;
		$scope.saving = false;
		$scope.saved = false;
		$scope.cancelled = false;
		const req: any = {
			method: 'GET',
			url: $scope.adminAccountsEndpoint,
		};
		switch ( i ) {
			case 0:
				//First tab selected
				req.params = $scope.searchParams;
				Utils.getHttpPromise( req ).then( function( resp: any ) {
					$scope.adminAccounts = resp.admin_users;
				}, function( errResp: Error ) {
					Debug.error( errResp );
				} ).finally( function() {
					$scope.loading = false;
				} );
				break;
			case 1:
				$scope.loading = false;
				break;
			case 2:
				$scope.loading = false;
				break;
		}
	};

	/**
	 * Changes a tab
	 *
	 * @param {number} tabIndex     - The index of the tab to change to
	 * @param {number} accountIndex - The index of the selected admin account to load
	 */
	$scope.ChangeTab = function( tabIndex: number, accountIndex: number ) {
		$scope.activeTab = tabIndex;
		$scope.selectedAccount = $scope.adminAccounts.data[ accountIndex ];
		if ( ! $scope.selectedAccount.deleted_at ) {
			$scope.selectedAccount.active = true;
		} else {
			$scope.selectedAccount.active = false;
		}

		if ( $scope.selectedAccount.receive_quotes === 1 ) {
			$scope.selectedAccount.receive_quotes = true;
		}

		const roles = $scope.selectedAccount.roles;
		$scope.selectedAccount.roles = [];
		angular.forEach( roles, function( role ) {
			$scope.selectedAccount.roles[ role.slug ] = true;
		} );
	};

	/**
	 * Add new admin user
	 */
	$scope.AddUser = function() {
		$scope.saving = true;
		const params: any = {
			name: $scope.newAdmin.name,
			email: $scope.newAdmin.email,
			password: $scope.newAdmin.password,
			password_confirmation: $scope.newAdmin.confPassword,
			receive_quotes: $scope.newAdmin.receive_quotes,
		};
		if ( $scope.newAdmin.active === true ) {
			params.active = 1;
		} else {
			params.active = 0;
		}
		params.roles = [];

		Object.keys( $scope.newAdmin.roles ).forEach( function( slug ) {
			if ( $scope.newAdmin.roles[ slug ] ) {
				params.roles.push( slug );
			}
		} );

		const req = {
			method: 'POST',
			url: $scope.adminAccountsEndpoint,
			data: params,
		};
		Utils.getHttpPromise( req ).then( function( resp: any ) {
			Debug.log( resp );
		}, function( errResp: Error ) {
			Debug.error( errResp );
		} ).finally( function() {
			$scope.loading = false;
			$scope.saving = false;
			$scope.ChangeTab( 0 );
		} );
	};

	/**
	 * Updates Admin User
	 */
	$scope.UpdateUser = function() {
		$scope.saving = true;
		const params: any = {};
		if ( $scope.selectedAccount.active === true ) {
			params.active = 1;
		} else {
			params.active = 0;
		}
		params.password = $scope.selectedAccount.new_password;
		params.password_confirmation = $scope.selectedAccount.passwordCheck;
		params.email = $scope.selectedAccount.email;
		params.name = $scope.selectedAccount.name;
		params.user_id = $scope.selectedAccount.id;
		params.receive_quotes = $scope.selectedAccount.receive_quotes;
		params.roles = [];

		Object.keys( $scope.selectedAccount.roles ).forEach( function( slug ) {
			if ( $scope.selectedAccount.roles[ slug ] ) {
				params.roles.push( slug );
			}
		} );

		const req = {
			method: 'PUT',
			url: $scope.adminAccountsEndpoint + $scope.selectedAccount.id,
			data: params,
		};
		Utils.getHttpPromise( req )
			.then( function() {
				angular.noop();
			}, function( errResp: Error ) {
				Debug.error( errResp );
			} ).finally( function() {
				$scope.loading = false;
				$scope.saving = false;
			} );
	};

	this.searchAccounts = () => {
		$scope.loadingMore = true;
		const req = {
			method: 'GET',
			url: $scope.adminAccountsEndpoint,
			params: $scope.searchParams,
		};
		Utils.getHttpPromise( req )
			.then( ( resp: any ) => {
				$scope.adminAccounts = resp.admin_users;
			}, ( errResp: Error ) => {
				Debug.error( errResp );
			} )
			.finally( () => {
				$scope.loadingMore = false;
			} );
	};

	this.setPage = ( page: number ) => {
		$scope.searchParams.page = page;
		this.searchAccounts();
	};

	this.setRpp = ( rpp: number ) => {
		$scope.searchParams.rpp = rpp;
		this.searchAccounts();
	};

	this.setQuery = ( query: string ) => {
		$scope.searchParams.page = 1; // Reset page when query changes.
		$scope.searchParams.q = query;
		$scope.searchTerm = $scope.searchParams.q;
		this.searchAccounts();
	};

	/**
	 * Genereate a REST Api token for selected Admin
	 */
	$scope.GenerateRESTAccess = function() {
		const req = {
			method: 'GET',
			url: $scope.adminAccountsEndpoint + 'rest/generate/' + $scope.selectedAccount.id,
		};
		const callback = {
			confirm() {
				angular.noop();
			},
		};
		Utils.getHttpPromise( req ).then( function( resp: any ) {
			if ( ! resp.errors.length ) {
				AlertModal.Show(
					callback,
					resp.notifications[ 0 ],
					resp.rest_api_key,
					'Close',
				);
				$scope.selectedAccount.rest_api_user = resp.rest_api_user;
			}
		}, function( errResp: Error ) {
			Debug.error( errResp );
		} ).finally( function() {
			angular.noop();
		} );
	};

	/**
	 * Revoke the REST Api token for selected Admin
	 */
	$scope.RevokeRESTAccess = function() {
		ConfirmModal.Show( {
			confirm() {
				const req = {
					method: 'GET',
					url: $scope.adminAccountsEndpoint + 'rest/revoke/' + $scope.selectedAccount.id,
				};
				Utils.getHttpPromise( req ).then( function( resp: any ) {
					if ( ! resp.errors.length ) {
						$scope.selectedAccount.rest_api_user = null;
					}
				}, function( errResp: Error ) {
					Debug.error( errResp );
				} ).finally( function() {
					angular.noop();
				} );
			}, cancel() {
				angular.noop();
			},
		},
		'Revoke REST API Key/User?',
		'This will immediately revoke the current REST API Key/User in use.',
		'No',
		'Yes',
		);
	};

	/**
	 * Toggles showing password characters
	 *
	 * @param {number} type - The type of password box to toggle
	 */
	$scope.ToggleShowPassword = function( type: 'password' | 'conf' ) {
		if ( type === 'password' ) {
			$scope.showPassword = ! $scope.showPassword;
		}
		if ( type === 'conf' ) {
			$scope.showPasswordConf = ! $scope.showPasswordConf;
		}
	};
}

