import Papa from 'papaparse';
import { tinymceOptions } from '../../../data/tinymceOptions';
import template from './products-index.component.html';
declare const angular: ng.IAngularStatic;

export const ProductsIndex: ng.IComponentOptions = {
	template,
	controller,
};

controller.$inject = [
	'$scope',
	'$state',
	'$stateParams',
	'Admin',
	'Settings',
	'Debug',
	'Utils',
	'Localized',
	'Products',
	'SearchModal',
	'$timeout',
	'$window',
];

function controller(
	$scope: any,
	$state: ng.ui.IStateService,
	$stateParams: ng.ui.IStateParamsService,
	Admin: any,
	Settings: any,
	Debug: any,
	Utils: any,
	Localized: any,
	Products: any,
	SearchModal: any,
	$timeout: ng.ITimeoutService,
	$window: ng.IWindowService,
) {
	const vm = this;
	this.placeholderImg = `${ localized.dir.url }assets/img/placeholder-150px.png`;
	this.tinymceOptions = tinymceOptions;

	vm.searchOptions = {
		product_id: 'ID',
		description: 'Name',
		sku: 'SKU',
	};

	/**
	 * Initialization
	 */
	this.init = () => {
		vm.productSlug = localized.settings.general.product_slug || 'products';

		this.breadcrumbs = [
			{ name: 'Catalog', state: 'catalog.page' },
			{ name: 'Products', state: 'catalog.products.index' },
		];

		$scope.activeTab = parseInt( $stateParams.activeTab ) || 0;
		$scope.attributesLength = 36;
		$scope.batchEndpoint = localized.apiURL + '/admin/product/batch/';
		$scope.batchListOptions = {
			any: 'All',
			pending: 'Pending',
			confirmed: 'Confirmed',
			processing: 'Processing',
			processed: 'Processed',
		};
		$scope.isAuthed = Admin.Authed();
		$scope.loading = true;
		$scope.loadingMore = false;
		$scope.maxAttributes = 18;
		$scope.myFile = {};
		this.product = {
			status: 'active',
			images: {},
			pricesheets: [],
			parcels: [],
			meta: {},
		};
		$scope.noteParams = {
			note: '',
		};
		$scope.numAttributes = [];
		$scope.parcelWeightUnits = {
			lb: 'Pounds',
			kg: 'Kilograms',
		};
		$scope.productEndpoint = localized.apiURL + '/admin/products/';
		$scope.productNotes = [];
		$scope.products = [];
		$scope.productsFactory = Products;
		$scope.regValues = [
			{ key: '1', value: 'Yes' },
			{ key: '0', value: 'No' },
		];
		$scope.removingImage = false;
		$scope.rppValues = [ 15, 30, 50, 100 ];
		$scope.saved = false;
		$scope.saving = false;
		$scope.scrollSlides = 0;
		$scope.savingNote = false;
		$scope.searchModalPage = '';
		$scope.searchTerm = '';
		$scope.selectedBatch = null;
		$scope.selectedProduct = $stateParams.product || null;
		$scope.slides = 0;
		$scope.sortBatchParams = {
			sort_by: 'batch_id',
			sort_type: '',
			status: 'any',
		};

		vm.searchParams = {
			page: 1,
			rpp: $scope.rppValues[ 0 ], // Must define after rppValues is declared.
		};

		if ( ( $scope.activeTab === 2 && ! $scope.selectedProduct ) || ( $scope.activeTab === 5 && ! $scope.selectedBatch ) ) {
			$scope.activeTab = 0;
		}
	};
	this.init();

	this.tabChanged = ( i: number ) => {
		$scope.activeTab = i;
		$state.go( 'catalog.products.index', { activeTab: $scope.activeTab } );
		Settings.errors = {};
		$scope.loading = true;
		$scope.saving = false;
		$scope.saved = false;
		$scope.cancelled = false;
		let req = {
			method: 'GET',
			url: $scope.productEndpoint,
		} as any;

		switch ( i ) {
			case 0:
				Utils.getHttpPromise( req ).then( ( resp: any ) => {
					$scope.products = resp.products;
					$scope.totalProducts = resp.products.total;
				}, ( errResp: Error ) => {
					Debug.error( errResp );
				} ).finally( () => {
					$scope.loading = false;
				} );
				break;
			case 1:

				this.slickSetup();
				$scope.loading = false;
				break;
			case 2:
				// eslint-disable-next-line no-var
				var done = 0,
					total = 2;
				req.url += $scope.selectedProduct.product_id;
				Utils.getHttpPromise( req ).then( ( resp: any ) => {
					$scope.selectedProduct = resp.product;
					$scope.numAttributes = [];
					// eslint-disable-next-line no-shadow
					for ( let i = 1; i <= 18; i++ ) {
						if ( $scope.selectedProduct[ 'att' + i + 'n' ] || $scope.selectedProduct[ 'att' + i + 'd' ] ) {
							$scope.numAttributes.push( i );
						}
					}

					if ( ! $scope.selectedProduct.meta ) {
						$scope.selectedProduct.meta = {};
					}
				}, ( errResp: Error ) => {
					Debug.error( errResp );
				} ).finally( () => {
					if ( ++done >= total ) {
						$scope.loading = false;
					}
					this.slickSetup();
				} );
				req = {
					method: 'GET',
					url: localized.apiURL + '/admin/product/note',
					params: {
						product_id: $scope.selectedProduct.product_id,
					},
				};
				Utils.getHttpPromise( req ).then( ( resp: any ) => {
					$scope.productNotes = resp.notes;
				}, ( errResp: Error ) => {
					Debug.error( errResp );
				} ).finally( () => {
					if ( ++done >= total ) {
						$scope.loading = false;
					}
				} );
				break;
			case 3:
				$scope.loading = false;
				break;
			case 5:
				req = {
					method: 'GET',
					url: $scope.batchEndpoint + $scope.selectedBatch.batch_id,
				};
				Utils.getHttpPromise( req ).then( ( resp: any ) => {
					$scope.selectedBatch = resp.batches[ 0 ];
					$scope.batchHeaders = resp.batches[ 0 ].columns;
				}, ( errResp: Error ) => {
					Debug.error( errResp );
				} ).finally( () => {
					$scope.loading = false;
				} );
				break;
			default:
				$scope.loading = false;
				break;
		}
	};

	/**
	 * @param {number} productIndex Product index
	 * @param {Object} e            Click event
	 */
	this.editProduct = ( productIndex: number, e: Event ) => {
		if ( e ) {
			e.preventDefault();
		}
		const tabIndex = 2;
		$scope.activeTab = tabIndex;
		$scope.selectedProduct = $scope.products.data[ productIndex ];
	};

	/*
			* Attributes
			*/
	this.addAttribute = () => {
		if ( $scope.numAttributes.length >= $scope.maxAttributes ) {
			return;
		}
		let i = 1;
		while ( $scope.numAttributes.indexOf( i ) !== -1 ) {
			i++;
		}
		$scope.numAttributes.push( i );
	};

	this.removeAttribute = ( i: number ) => {
		if ( $scope.activeTab === 1 ) {
			$scope.numAttributes.splice( i - 1, 1 );
			this.product[ 'att' + ( i ) + 'n' ] = '';
			this.product[ 'att' + ( i ) + 'd' ] = '';
		} else if ( $scope.activeTab === 2 ) {
			$scope.numAttributes.splice( i - 1, 1 );
			$scope.selectedProduct[ 'att' + ( i ) + 'n' ] = '';
			$scope.selectedProduct[ 'att' + ( i ) + 'd' ] = '';
		}
	};

	/*
			* Utilities
			*/
	this.syncProductWPPosts = () => {
		const params = {};
		const data = {
		};
		Utils.httpGet( Localized.wpRestUrl + '/syncProductPosts', params, data )
			.then( () => {
				$scope.saving = false;
			} );
	};

	this.generateSlugs = () => {
		const req = {
			method: 'POST',
			url: $scope.productEndpoint + 'slug/generate',
		};
		Utils.getHttpPromise( req ).then( () => {
			angular.noop();
		}, ( errResp: Error ) => {
			Debug.error( errResp );
		} ).finally( () => {
			$scope.loading = false;
		} );
	};

	this.searchProducts = () => {
		$scope.loadingMore = true;
		const req = {
			method: 'GET',
			url: $scope.productEndpoint,
			params: vm.searchParams,
		};
		Utils.getHttpPromise( req )
			.then( ( resp: any ) => {
				$scope.products = resp.products;
			}, ( errResp: Error ) => {
				Debug.error( errResp );
			} ).finally( () => {
				$scope.loadingMore = false;
			} );
	};

	this.setPage = ( page: number ) => {
		this.searchParams.page = page;
		this.searchProducts();
	};

	this.setRpp = ( rpp: number ) => {
		this.searchParams.rpp = rpp;
		this.searchProducts();
	};

	this.setQuery = ( query: string, searchBy: string ) => {
		this.searchParams.page = 1; // Reset page when query changes.
		this.searchParams.q = query;
		this.searchParams.searchBy = searchBy;
		$scope.searchTerm = this.searchParams.q;
		this.searchedBy = this.searchParams.searchBy;
		this.searchProducts();
	};

	this.addProduct = () => {
		$scope.loading = true;
		const req = {
			method: 'POST',
			url: $scope.productEndpoint,
			data: this.product,
		};
		Utils.getHttpPromise( req )
			.then( ( response: any ) => {
				if ( ! response.errors.length ) {
					$scope.selectedProduct = {
						product_id: response.product_id,
					};
					$scope.activeTab = 2;
					this.product = {
						status: 'active',
						images: {},
						pricesheets: [],
						parcels: [],
					};
					const params = {
						id: response.product_id,
					};
					const data = {};
					Utils.httpGet( Localized.wpRestUrl + '/syncProductPosts', params, data )
						.then( () => {
							$scope.loading = false;
						} );
				}
			}, ( errResp: Error ) => {
				Debug.log( errResp );
			} ).finally( () => {
				$scope.loading = false;
			} );
	};

	this.checkImageLength = () => {
		if ( $scope.activeTab === 2 ) {
			if ( $scope.selectedProduct.images && Object.keys( $scope.selectedProduct.images ).length > 1 ) {
				if ( Object.keys( $scope.selectedProduct.images ).length >= 4 ) {
					$scope.slides = 3;
					$scope.scrollSlides = 3;
				} else {
					$scope.slides = Object.keys( $scope.selectedProduct.images ).length - 1;
					$scope.scrollSlides = 1;
				}
			} else {
				$scope.slides = 1;
				$scope.scrollSlides = 2;
			}
		} else if ( $scope.activeTab === 1 ) {
			if ( this.product.images && Object.keys( this.product.images ).length > 1 ) {
				if ( Object.keys( this.product.images ).length >= 4 ) {
					$scope.slides = 3;
					$scope.scrollSlides = 3;
				} else {
					$scope.slides = Object.keys( this.product.images ).length - 1;
					$scope.scrollSlides = 1;
				}
			} else {
				$scope.slides = 1;
				$scope.scrollSlides = 2;
			}
		}
	};

	this.openCatSearch = () => {
		$scope.searchModalPage = 'cat';
		let callback = {};
		const data = {
			tabs: [
				{
					http: {
						method: 'GET',
						url: localized.apiURL + '/admin/category/',
						params: {
							q: '',
						},
					},
					relationships: [ 'categories' ],
					fields: [ 'cat_id', 'title', 'parent_id' ],
					fieldPrefixes: [ 'ID: ', '', 'Parent ID: ' ],
					id: 'cat_id',
					selectOne: true,
				},
			],
		};
		callback = {
			confirm: this.searchResults,
			cancel: this.searchCancelled,
		};
		//callback object (confirm, cancel), title, message, optionCancel, optionConfirm, httpConfig
		SearchModal.Show( callback, 'Categories', data, 'Add items' );
	};

	this.openMediaFrame = () => {
		// eslint-disable-next-line no-undef
		const fileFrame = wp.media( {
			title: 'Select or Upload image',
			library: {
				type: 'image',
			},
			button: {
				text: 'Select',
			},
			multiple: false,
		} );
		fileFrame.on( 'select', () => {
			// We set multiple to false so only get one image from the uploader
			$scope.$apply( () => {
				$scope.attachment = fileFrame.state().get( 'selection' ).first().toJSON();
				$scope.removingImage = true;
				let assigned = false,
					i = 0;
				if ( $scope.activeTab === 2 ) {
					while ( ! assigned ) {
						// eslint-disable-next-line no-prototype-builtins
						if ( $scope.selectedProduct.images.hasOwnProperty( 'new' + i ) ) {
							i++;
						} else {
							$scope.selectedProduct.images[ i ] = {
								orig_url: $scope.attachment.sizes.full.url,
								url: $scope.attachment.sizes.thumbnail.url,
							};
							assigned = true;
						}
					}
				} else if ( $scope.activeTab === 1 ) {
					while ( ! assigned ) {
						// eslint-disable-next-line no-prototype-builtins
						if ( this.product.images.hasOwnProperty( 'new' + i ) ) {
							i++;
						} else {
							this.product.images[ i ] = {
								orig_url: $scope.attachment.sizes.full.url,
								url: $scope.attachment.sizes.thumbnail.url,
							};
							assigned = true;
						}
					}
				}
				this.checkImageLength();
				$scope.slickConfig.slidesToShow = $scope.slides;
				$scope.slickConfig.slidesToScroll = $scope.scrollSlides;
				$timeout( () => {
					$scope.removingImage = false;
				}, 500 );
			} );
		} );
		// Finally, open the modal
		fileFrame.open();
	};

	this.openMfgSearch = () => {
		$scope.searchModalPage = 'mfg';
		let callback = {};
		const data = {
			tabs: [
				{
					http: {
						method: 'GET',
						url: localized.apiURL + '/admin/manufacturers/',
						params: {
							q: '',
						},
					},
					relationships: [ 'manufacturers' ],
					fields: [ 'id', 'manufacturer', 'info', 'website' ],
					fieldPrefixes: [ '', '', 'Info: ', 'Website: ' ],
					id: 'id',
					selectOne: true,
				},
			],
		};
		callback = {
			confirm: this.searchResults,
			cancel: this.searchCancelled,
		};
		//callback object (confirm, cancel), title, message, optionCancel, optionConfirm, httpConfig
		SearchModal.Show( callback, 'Manufacturers', data, 'Add items' );
	};

	this.openPsSearch = () => {
		$scope.searchModalPage = 'ps';
		let callback = {};
		const data = {
			tabs: [
				{
					http: {
						method: 'GET',
						url: localized.apiURL + '/admin/pricesheets/',
						params: {
							q: '',
						},
					},
					relationships: [ 'pricesheets' ],
					fields: [ 'price_sheet_id', 'sheet' ],
					fieldPrefixes: [ 'ID: ', '' ],
					id: 'price_sheet_id',
					selectOne: false,
				},
			],
		};
		callback = {
			confirm: this.searchResults,
			cancel: this.searchCancelled,
		};
		//callback object (confirm, cancel), title, message, optionCancel, optionConfirm, httpConfig
		SearchModal.Show( callback, 'Price Sheets', data, 'Add items' );
	};

	this.openParcelSearch = () => {
		$scope.searchModalPage = 'parcel';
		let callback = {};
		const data = {
			tabs: [
				{
					http: {
						method: 'GET',
						url: localized.apiURL + '/admin/shipping/parcel/',
						params: {
							q: '',
						},
					},
					relationships: [ 'parcels' ],
					fields: [ 'id', 'title' ],
					fieldPrefixes: [ 'ID: ', '' ],
					id: 'id',
					selectOne: false,
				},
			],
		};
		callback = {
			confirm: this.searchResults,
			cancel: this.searchCancelled,
		};
		//callback object (confirm, cancel), title, message, optionCancel, optionConfirm, httpConfig
		SearchModal.Show( callback, 'Parcels', data, 'Add items' );
	};

	this.removeImage = ( i: number ) => {
		$scope.removingImage = true;
		if ( $scope.activeTab === 1 ) {
			delete this.product.images[ i ];
		} else if ( $scope.activeTab === 2 ) {
			if ( $scope.selectedProduct.images[ i ].wpImg ) {
				delete $scope.selectedProduct.images[ i ];
			} else {
				$scope.selectedProduct.images[ i ].deleted = true;
			}
		}
		this.checkImageLength();
		$scope.slickConfig.slidesToShow = $scope.slides;
		$scope.slickConfig.slidesToScroll = $scope.scrollSlides;
		$timeout( () => {
			$scope.removingImage = false;
		}, 500 );
	};

	this.removeParcel = ( i: number ) => {
		if ( $scope.activeTab === 1 ) {
			this.product.parcels.splice( i, 1 );
		} else if ( $scope.activeTab === 2 ) {
			$scope.selectedProduct.parcels.splice( i, 1 );
		}
	};

	this.removePricesheet = ( i: number ) => {
		if ( $scope.activeTab === 1 ) {
			this.product.pricesheets.splice( i, 1 );
		} else if ( $scope.activeTab === 2 ) {
			$scope.selectedProduct.pricesheets[ i ].deleted = true;
		}
	};

	this.searchCancelled = () => {
		angular.noop();
	};

	this.searchResults = ( resp: any ) => {
		if ( $scope.activeTab === 1 ) {
			switch ( $scope.searchModalPage ) {
				case 'mfg':
					this.product.manufacturer_id = resp[ 0 ].value.id;
					this.product.manufacturer = resp[ 0 ].value.name;
					break;
				case 'cat':
					this.product.category_id = resp[ 0 ].value.cat_id;
					this.product.category = resp[ 0 ].value;
					break;
				case 'ps':
					for ( let i = 0; i < resp.length; i++ ) {
						let skip = false;
						for ( let j = 0; j < this.product.pricesheets.length; j++ ) {
							if ( resp[ i ].value.price_sheet_id === this.product.pricesheets[ j ].price_sheet_id ) {
								skip = true;
								break;
							}
						}
						if ( ! skip ) {
							this.product.pricesheets.push( {
								pricesheetindex: resp[ i ].value,
								ps_item_id: 0,
								price_sheet_id: resp[ i ].value.price_sheet_id,
								price: 0,
							} );
						}
					}
					break;
				case 'parcel':
					for ( let k = 0; k < resp.length; k++ ) {
						let skip2 = false;
						for ( let l = 0; l < this.product.parcels.length; l++ ) {
							if ( resp[ k ].value.id === this.product.parcels[ l ].id ) {
								skip2 = true;
								break;
							}
						}
						if ( ! skip2 ) {
							this.product.parcels.push( resp[ k ].value );
							this.product.parcels[ this.product.parcels.length - 1 ].pivot = {
								parcel_id: resp[ k ].value.id,
								weight: '',
								mass_unit: '',
							};
						}
					}
					break;
			}
		} else if ( $scope.activeTab === 2 ) {
			switch ( $scope.searchModalPage ) {
				case 'mfg':
					$scope.selectedProduct.manufacturer_id = resp[ 0 ].value.id;
					$scope.selectedProduct.manufacturer = resp[ 0 ].value;
					break;
				case 'cat':
					$scope.selectedProduct.category_id = resp[ 0 ].value.cat_id;
					$scope.selectedProduct.category = resp[ 0 ].value;
					break;
				case 'ps':
					for ( let q = 0; q < resp.length; q++ ) {
						let skip3 = false;
						for ( let r = 0; r < $scope.selectedProduct.pricesheets.length; r++ ) {
							if ( resp[ q ].value.price_sheet_id === $scope.selectedProduct.pricesheets[ r ].price_sheet_id ) {
								skip3 = true;
								$scope.selectedProduct.pricesheets[ r ].deleted = false;
								$scope.selectedProduct.pricesheets[ r ].price = 0.00;
								break;
							}
						}
						if ( ! skip3 ) {
							$scope.selectedProduct.pricesheets.push( {
								pricesheetindex: resp[ q ].value,
								ps_item_id: 0,
								price_sheet_id: resp[ q ].value.price_sheet_id,
								price: 0,
								product_id: $scope.selectedProduct.product_id,
								sku: $scope.selectedProduct.sku,
							} );
						}
					}
					break;
				case 'parcel':
					for ( let t = 0; t < resp.length; t++ ) {
						let skip4 = false;
						for ( let y = 0; y < $scope.selectedProduct.parcels.length; y++ ) {
							if ( resp[ t ].value.id === $scope.selectedProduct.parcels[ y ].id ) {
								skip4 = true;
								break;
							}
						}
						if ( ! skip4 ) {
							$scope.selectedProduct.parcels.push( resp[ t ].value );
							$scope.selectedProduct.parcels[ $scope.selectedProduct.parcels.length - 1 ].pivot = {
								parcel_id: resp[ t ].value.id,
								product_id: $scope.selectedProduct.product_id,
								weight: '',
								mass_unit: '',
							};
						}
					}
					break;
			}
		}
	};

	/*
			* Batches
			*/
	$scope.SetUploading = () => {
		// eslint-disable-next-line no-shadow
		$scope.$apply( ( $scope: any ) => {
			$scope.uploading = ! $scope.uploading;
		} );
	};

	$scope.setFile = ( element: HTMLFormElement ) => {
		// eslint-disable-next-line no-shadow
		$scope.$apply( ( $scope: any ) => {
			$scope.theFile = element.files[ 0 ];
		} );
		const totalBytes = $scope.theFile.size;
		if ( totalBytes < 1000000 ) {
			$scope.fileSize = Math.floor( totalBytes / 1000 ) + 'KB';
		} else {
			$scope.fileSize = Math.floor( totalBytes / 1000000 ) + 'MB';
		}
		const regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
		if ( regex.test( $scope.theFile.name.toLowerCase() ) ) {
			if ( typeof ( FileReader ) !== 'undefined' ) {
				const reader = new FileReader() as any;
				reader.onload = () => {
					// eslint-disable-next-line no-undef
					Papa.parse( reader.result, {
						complete( results: any ) {
							const products = [] as any;
							for ( let i = 0; i <= results.data.length; i++ ) {
								const info = results.data[ i ];
								const product = [] as any;
								// eslint-disable-next-line no-loop-func
								angular.forEach( info, ( val, key ) => {
									product[ key ] = val;
								} );
								products.push( product );
							}

							$scope.$apply( () => {
								$scope.prodSheetUpload = products;
								$scope.IsVisible = true;
							} );
						},
					} );

					$scope.SetUploading();
				};
				reader.readAsText( $scope.theFile );
			} else {
				$window.alert( 'This browser does not support HTML5.' );
			}
		} else {
			$scope.theFile = null;
			$scope.prodSheetUpload = null;
			$scope.SetUploading();
			$window.alert( 'Please upload a valid CSV file.' );
		}
	};

	this.slickSetup = () => {
		this.checkImageLength();
		$scope.slickConfig = {
			enabled: true,
			arrows: true,
			slidesToShow: $scope.slides,
			slidesToScroll: $scope.scrollSlides,
			autoplay: true,
			draggable: true,
			autoplaySpeed: 3000,
			method: {},
			event: {
				beforeChange() {
					angular.noop();
				},
				afterChange() {
					angular.noop();
				},
			},
		};
	};
	/**
	 * @param {string} sortBy Sortby term
	 * @param {Object} e      Click event
	 */
	this.changeSortBy = ( sortBy: string, e: Event ) => {
		e.preventDefault();
		vm.sortAscending = ( vm.searchParams.sortBy === sortBy ) ? ! vm.sortAscending : true;
		vm.searchParams.sortBy = sortBy;
		vm.searchParams.sortType = vm.sortAscending ? 'asc' : 'desc';
		this.searchProducts( vm.searchParams.page );
	};

	this.updateProduct = () => {
		$scope.loading = true;
		const req = {
			method: 'PUT',
			url: $scope.productEndpoint + $scope.selectedProduct.product_id,
			data: $scope.selectedProduct,
		};
		Utils.getHttpPromise( req ).then( ( resp: any ) => {
			$scope.activeTab = 2;
			const req2 = {
				method: 'GET',
				url: Localized.wpRestUrl + '/syncProductPosts',
				params: {
					id: resp.product_id,
				},
			};
			Utils
				.getHttpPromise( req2 )
				// eslint-disable-next-line no-shadow
				.then( () => {
					$scope.loading = false;
				} );
		}, ( errResp: Error ) => {
			Debug.error( errResp );
		} ).finally( () => {
			$scope.loading = false;
		} );
	};

	this.copyProduct = ( product: any ) => {
		this.product = {
			description: `${ product.description } copy`,
			sku: '',
			status: 'active',
			images: {},
			pricesheets: [],
			parcels: [],
			meta: {},
		};

		// Loop through product props and add only if it exists, or the API will complain.
		const keys = [ 'upc', 'categories', 'uomid', 'uomdesc', 'includes', 'brand_name', 'long_description', 'mfg_part_num', 'ability_one_sku', 'green_attributes', 'hazmat', 'country', 'keywords', 'related', 'alernates', 'device', 'family', 'model', 'avatax_tax_code', 'prop65_warning', 'site_id', 'manufacturer_id', 'category_id', 'uomqty', 'rebate', 'green', 'truck_only', 'prop65', 'ignore_inventory', 'additional_shipping' ];
		keys.forEach( ( key ) => {
			if ( product[ key ] ) {
				this.product[ key ] = product[ key ];
			}
		} );

		// Loop through array props.
		const arrayKeys = [ 'documents' ];
		arrayKeys.forEach( ( key ) => {
			if ( product[ key ].length ) {
				this.product[ key ] = product[ key ];
			}
		} );

		// Loop through attributes.
		if ( product.attributes?.length ) {
			product.attributes.forEach( ( attribute: { name: string, value: string }, index: number ) => {
				this.product[ `att${ index + 1 }n` ] = attribute.name;
				this.product[ `att${ index + 1 }d` ] = attribute.value;
			} );
		}

		this.tabChanged( 1 );
	};

	this.postUpload = ( index: number, id: number ) => {
		$scope.selectedBatch = {
			batch_id: id,
		};
		$scope.activeTab = index;
	};

	this.uploadProduct = () => {
		$scope.loading = true;
		const fd = new FormData();
		fd.append( 'file', $scope.theFile, $scope.theFile.name );
		const req = {
			method: 'POST',
			url: $scope.batchEndpoint + 'upload',
			data: fd,
			transformRequest: angular.identity,
			headers: {
				// eslint-disable-next-line no-undefined
				'Content-Type': undefined as undefined,
			},
		};
		Utils.getHttpPromise( req ).then( ( resp: any ) => {
			if ( ! resp.errors.length ) {
				this.postUpload( 5, resp.batch_id );
			}
		}, ( errResp: Error ) => {
			Debug.error( errResp );
		} ).finally( () => {
			$scope.loading = false;
		} );
	};

	this.uploadInventory = () => {
		$scope.loading = true;
		const fd = new FormData();
		fd.append( 'file', $scope.theFile, $scope.theFile.name );
		const req = {
			method: 'POST',
			url: $scope.productEndpoint + 'inventory/upload',
			data: fd,
			transformRequest: angular.identity,
			headers: {
				// eslint-disable-next-line no-undefined
				'Content-Type': undefined as undefined,
			},
		};
		Utils.getHttpPromise( req ).then( () => {
			angular.noop();
		}, ( errResp: Error ) => {
			Debug.error( errResp );
		} ).finally( () => {
			$scope.loading = false;
		} );
	};

	this.sortBatchIndex = ( sortBy: string ) => {
		vm.sortAscending = ( $scope.sortBatchParams.sort_by === sortBy ) ? ! vm.sortAscending : true;
		$scope.sortBatchParams.sort_by = sortBy;
		$scope.sortBatchParams.sort_type = vm.sortAscending ? 'asc' : 'desc';
		this.sortBatches();
	};

	this.sortBatches = () => {
		$scope.loadingMore = true;
		const req = {
			method: 'GET',
			url: $scope.batchEndpoint,
			params: $scope.sortBatchParams,
		};
		Utils.getHttpPromise( req ).then( ( resp: any ) => {
			$scope.batches = resp.search_results;
			for ( let i = 0; i < $scope.batches.length; i++ ) {
				if ( $scope.batches[ i ].status === 'processing' ) {
					this.updateBatchProgress();
					break;
				}
			}
		}, ( errResp: Error ) => {
			Debug.error( errResp );
		} ).finally( () => {
			$scope.loadingMore = false;
		} );
	};

	this.confirmBatch = () => {
		$scope.loading = true;
		const req = {
			method: 'POST',
			url: $scope.batchEndpoint + 'confirm',
			data: {
				batch_id: $scope.selectedBatch.batch_id,
			},
		};
		Utils.getHttpPromise( req ).then( () => {
			$scope.selectedBatch = null;
			$scope.activeTab = 4;
		}, ( errResp: Error ) => {
			Debug.error( errResp );
		} ).finally( () => {
			$scope.loading = false;
		} );
	};

	this.changeBatchTab = ( tabIndex: number, batchIndex: number ) => {
		$scope.activeTab = tabIndex;
		$scope.selectedBatch = $scope.batches[ batchIndex ];
	};

	this.updateBatchProgress = () => {
		const req = {
			method: 'GET',
			url: $scope.batchEndpoint,
			params: $scope.sortBatchParams,
		};
		let again = false;
		Utils.getHttpPromise( req ).then( ( resp: any ) => {
			$scope.batches = resp.search_results;
			for ( let i = 0; i < $scope.batches.length; i++ ) {
				if ( $scope.batches[ i ].status === 'processing' && $scope.activeTab === 4 ) {
					again = true;
					break;
				}
			}
			if ( again ) {
				$timeout( () => {
					this.updateBatchProgress();
				}, 5000 );
			}
		}, ( errResp: Error ) => {
			Debug.error( errResp );
		} );
	};

	/*
			* Note Functions
			*
			*/
	this.LoadNotes = () => {
		const req = {
			method: 'GET',
			url: localized.apiURL + '/admin/product/note',
			params: {
				product_id: $scope.selectedProduct.product_id,
			},
		};
		Utils.getHttpPromise( req ).then( ( resp: any ) => {
			$scope.productNotes = resp.notes;
		}, ( errResp: Error ) => {
			Debug.error( errResp );
		} ).finally( () => {
			$scope.savingNote = false;
		} );
	};

	this.saveNote = () => {
		$scope.savingNote = true;
		$scope.noteParams.product_id = $scope.selectedProduct.product_id;
		const req = {
			method: 'POST',
			url: localized.apiURL + '/admin/product/note/',
			data: $scope.noteParams,
		};
		Utils.getHttpPromise( req ).then( () => {
			this.LoadNotes();
			$scope.noteParams.note = '';
		}, ( errResp: Error ) => {
			Debug.error( errResp );
		} );
	};

	this.deleteNote = ( id: number ) => {
		$scope.savingNote = true;
		const req = {
			method: 'DELETE',
			url: localized.apiURL + '/admin/product/note/' + id,
		};
		Utils.getHttpPromise( req ).then( () => {
			this.LoadNotes();
		}, ( errResp: Error ) => {
			Debug.error( errResp );
		} );
	};

	$scope.AddDocument = ( documents: { name: string, url: string }[] ) => {
		documents.push( { name: '', url: '' } );
	};

	$scope.RemoveDocument = ( documents: { name: string, url: string }[], index: number ) => {
		documents.splice( index, 1 );
	};
}

