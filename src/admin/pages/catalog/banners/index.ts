import { tinymceOptions } from '../../../data/tinymceOptions';
import template from './index.template.html';
import { nextApiURL } from '../../../data/nextApiURL';
import { apiURL } from '../../../data/apiURL';
import type { ConfirmModalService } from '../../../components/ui/modals/confirm-modal.service';

export const BannersIndex: ng.IComponentOptions = {
	template,
	controller,
};

controller.$inject = [
	'$http',
	'$scope',
	'$stateParams',
	'Admin',
	'ConfirmModal',
	'Debug',
	'Utils',
];

function controller(
	$http: ng.IHttpService,
	$scope: ng.IScope,
	$stateParams: ng.ui.IStateParamsService,
	Admin: any,
	ConfirmModal: ConfirmModalService,
	Debug: any,
	Utils: any
) {
	this.tinymceOptions = tinymceOptions;

	/**
	 * Initialization
	 */
	this.$onInit = () => {
		this.breadcrumbs = [
			{ label: 'Catalog', href: '?page=vf-catalog' },
			{ label: 'Banners', href: '?page=vendorfuel#/catalog/banners/0' },
		];

		this.getPricesheets();
		this.getGroups();

		$scope.activeTab = parseInt($stateParams.activeTab) || 0;
		$scope.bannerAreaEndpoint = localized.apiURL + '/admin/banner-areas/';
		$scope.bannerEndpoint = localized.apiURL + '/admin/banner/';
		$scope.isAuthed = Admin.Authed();
		$scope.loading = false;
		$scope.loadingMore = false;
		$scope.newBanner = {};
		$scope.newBannerArea = {};
		$scope.object = Object;
		$scope.rppValues = [15, 30, 50, 100];
		$scope.per_page = $scope.rppValues[0]; // Must come after $scope.rppValues declaration.
		$scope.searchParams = {
			q: '',
			sortBy: '',
			sortType: '',
			rpp: $scope.rppValues[0],
		};
		$scope.searchTerm = '';
		$scope.selectedBanner = null;
		$scope.selectedBannerArea = null;
		$scope.sortAscending = true;
		$scope.TinyMCEOptions = {
			theme: 'modern',
			plugins:
				'advlist autolink link image lists charmap print preview fullscreen code',
			toolbar:
				'numlist bullist | undo redo | styleselect | bold italic | link image alignleft aligncenter alignright | preview code | fullscreen',
		};
	};

	this.getPricesheets = () => {
		const url = `${nextApiURL}/admin/pricesheets`;
		$http.get(url).then((response) => {
			this.pricesheets = response.data.pricesheets.data.map(
				(pricesheet) => {
					return {
						label: pricesheet.sheet,
						value: pricesheet.price_sheet_id,
					};
				}
			);
		});
	};

	this.getGroups = () => {
		const url = apiURL.GROUPS;
		$http.get(url).then((response) => {
			this.groups = response.data.groups.data.map((group) => {
				return {
					label: group.name,
					value: group.group_id,
				};
			});
		});
	};

	$scope.LoginCallback = () => {
		$scope.loading = true;
		//logged in, do something. i.e. make api calls to load current tab's data
	};

	const getBannerAreas = () => {
		const req = {
			method: 'GET',
			url: $scope.bannerAreaEndpoint,
		};
		Utils.getHttpPromise(req)
			.then(
				(resp: any) => {
					$scope.bannerAreas = resp.banner_areas;
				},
				(errResp: Error) => {
					Debug.error(errResp);
				}
			)
			.finally(() => {
				$scope.loading = false;
			});
	};

	const createBannerArea = () => {
		$scope.loading = false;
	};

	const createBanner = () => {
		if ($scope.selectedBannerArea) {
			$scope.newBanner.area_id = $scope.selectedBannerArea.area_id;
		}
		$scope.loading = false;
	};

	const editBannerArea = () => {
		const req = {
			method: 'GET',
			url: $scope.bannerAreaEndpoint,
		};
		req.url += $scope.selectedBannerArea.area_id;
		Utils.getHttpPromise(req)
			.then(
				(resp: any) => {
					$scope.selectedBannerArea = resp.banner_area;
				},
				(errResp: Error) => {
					Debug.error(errResp);
				}
			)
			.finally(() => {
				$scope.loading = false;
			});
	};

	const editBanner = () => {
		$scope.loading = false;
	};

	$scope.TabChanged = (i: number) => {
		$scope.activeTab = i;
		$scope.loading = true;
		$scope.saving = false;
		$scope.saved = false;
		$scope.cancelled = false;

		switch (i) {
			case 0:
				getBannerAreas();
				break;
			case 1:
				createBannerArea();
				break;
			case 2:
				createBanner();
				break;
			case 3:
				editBannerArea();
				break;
			case 4:
				editBanner();
				break;
		}
	};

	$scope.AddBanner = () => {
		$scope.addingBanner = true;
		const req = {
			method: 'POST',
			url: $scope.bannerEndpoint,
			data: $scope.newBanner,
		};
		Utils.getHttpPromise(req)
			.then(
				(resp: any) => {
					if (resp.errors.length <= 0) {
						$scope.activeTab = 3;
						$scope.newBanner = {};
					}
				},
				(errResp: Error) => {
					Debug.error(errResp);
				}
			)
			.finally(() => {
				$scope.addingBanner = false;
			});
	};
	$scope.AddBannerArea = () => {
		$scope.loading = true;
		const req = {
			method: 'POST',
			url: $scope.bannerAreaEndpoint,
			data: $scope.newBannerArea,
		};
		Utils.getHttpPromise(req)
			.then(
				(resp: any) => {
					if (!resp.errors.length) {
						$scope.selectedBannerArea = {
							area_id: resp.area_id,
						};
						$scope.activeTab = 3;
						$scope.newBannerArea = {};
					}
				},
				(errResp: Error) => {
					Debug.error(errResp);
				}
			)
			.finally(() => {
				$scope.loading = false;
			});
	};

	$scope.ChangeTab = (tabIndex: number, index: number, event?: Event) => {
		if (event) {
			event.preventDefault();
		}

		$scope.activeTab = tabIndex;
		$scope.selectedBannerArea = $scope.bannerAreas.data[index];
	};

	$scope.ChangeBannerTab = (tabIndex: number, index: number) => {
		$scope.activeTab = tabIndex;
		$scope.selectedBanner = $scope.selectedBannerArea.banners[index];
	};
	$scope.RemoveBanner = () => {
		const callback = {
			confirm() {
				$scope.loading = true;
				const params = {
					bid: $scope.selectedBanner.banner_id,
				};
				const req = {
					method: 'DELETE',
					url: $scope.bannerEndpoint,
					data: params,
				};
				Utils.getHttpPromise(req)
					.then(
						(resp: any) => {
							if (resp.errors.length <= 0) {
								$scope.selectedBanner = {};
								$scope.activeTab = 3;
							}
						},
						(errResp: Error) => {
							Debug.error(errResp);
						}
					)
					.finally(() => {
						$scope.loading = false;
					});
			},
			cancel() {},
		};
		ConfirmModal.show(
			callback,
			'Delete Banner?',
			'This will completely remove the banner from the store. This action cannot be undone.',
			'Cancel',
			'Delete'
		);
	};

	$scope.RemoveBannerArea = () => {
		const callback = {
			confirm() {
				$scope.loading = true;
				const req = {
					method: 'DELETE',
					url:
						$scope.bannerAreaEndpoint +
						$scope.selectedBannerArea.area_id,
				};
				Utils.getHttpPromise(req)
					.then(
						(resp: any) => {
							if (!resp.errors.length) {
								$scope.selectedBannerArea = null;
								$scope.activeTab = 0;
							}
						},
						(errResp: Error) => {
							Debug.error(errResp);
						}
					)
					.finally(() => {
						$scope.loading = false;
					});
			},
			cancel() {},
		};
		ConfirmModal.show(
			callback,
			'Delete Banner Area?',
			'This will delete the area and all banners associated with it. This cannot be undone.',
			'Cancel',
			'Delete'
		);
	};
	$scope.SearchResults = (resp: any) => {
		//callback that is used by the search modal
		if ($scope.activeTab === 2) {
			$scope.addParams.products = [];
			resp.forEach((item: any) => {
				$scope.addParams.products.push(item.value);
			});
		}
		if ($scope.activeTab === 3) {
			$scope.editedProducts = [];
			resp.forEach((item: any) => {
				$scope.editedProducts.push(item.value.product_id);
			});
		}
	};
	$scope.SortIndex = (sortBy: string) => {
		$scope.sortAscending =
			$scope.searchParams.sortBy === sortBy
				? !$scope.sortAscending
				: true;
		$scope.searchParams.sortBy = sortBy;
		$scope.searchParams.sortType = $scope.sortAscending ? 'asc' : 'desc';
		$scope.SearchBannerAreas($scope.searchParams.page);
	};

	$scope.SearchBannerAreas = (page: number, query: string) => {
		$scope.loadingMore = true;
		$scope.searchParams.q = query;
		$scope.searchTerm = $scope.searchParams.q;
		$scope.searchParams.page = page || 1;
		const req = {
			method: 'GET',
			url: $scope.bannerAreaEndpoint,
			params: $scope.searchParams,
		};
		Utils.getHttpPromise(req)
			.then(
				(resp: any) => {
					$scope.bannerAreas = resp.banner_areas;
				},
				(errResp: Error) => {
					Debug.error(errResp);
				}
			)
			.finally(() => {
				$scope.loadingMore = false;
			});
	};

	$scope.UpdateBannerArea = () => {
		$scope.updatingArea = true;
		const req = {
			method: 'PUT',
			url: $scope.bannerAreaEndpoint + $scope.selectedBannerArea.area_id,
			data: $scope.selectedBannerArea,
		};
		Utils.getHttpPromise(req)
			.then(
				() => {},
				(errResp: Error) => {
					Debug.error(errResp);
				}
			)
			.finally(() => {
				$scope.updatingArea = false;
			});
	};
	$scope.UpdateBannerContent = () => {
		$scope.updatingBanner = true;
		const params = $scope.selectedBanner;
		params.bid = $scope.selectedBanner.banner_id;
		const req = {
			method: 'PUT',
			url: $scope.bannerEndpoint + $scope.selectedBanner.banner_id,
			data: params,
		};
		Utils.getHttpPromise(req)
			.then(
				() => {},
				(errResp: Error) => {
					Debug.error(errResp);
				}
			)
			.finally(() => {
				$scope.updatingBanner = false;
			});
	};
}
