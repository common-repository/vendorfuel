import template from './manufacturers-edit.component.html';

export const ManufacturerEdit: ng.IComponentOptions = {
	template,
	controller,
};

controller.$inject = [
	'$http',
	'$scope',
	'$state',
	'$stateParams',
	'Manufacturers',
];

function controller(
	$http: ng.IHttpService,
	$scope: ng.IScope,
	$state: ng.ui.IStateService,
	$stateParams: ng.ui.IStateParamsService,
	Manufacturers: any
) {
	this.breadcrumbs = [
		{ label: 'Catalog', href: '?page=vf-admin#/catalog' },
		{
			label: 'Manufacturers',
			href: '?page=vendorfuel#!/catalog/manufacturers',
		},
	];
	this.$onInit = () => {
		if ($stateParams.id) {
			this.getManufacturer($stateParams.id);
		} else {
			this.createManufacturer();
		}
	};

	this.changeLogo = (el: any) => {
		$scope.$apply(() => {
			this.manufacturer.logo = el.files[0];
		});
	};

	/**
	 */
	this.createManufacturer = () => {
		this.isNew = true;
		this.manufacturer = {};
		this.updateBreadcrumb();
	};

	this.getManufacturer = (id: number) => {
		this.isLoading = true;
		Manufacturers.get({ id }).$promise.then((manufacturer: any) => {
			this.manufacturer = manufacturer;
			if (this.manufacturer.images && this.manufacturer.images.logo) {
				this.logoFilename = new URL(
					this.manufacturer.images.logo.default
				).pathname
					.split('/')
					.pop();
			}
			this.updateBreadcrumb(this.manufacturer);
			this.isLoading = false;
		});
	};

	this.remove = () => {
		this.isDeleting = true;
		Manufacturers.delete({ id: this.manufacturer.id }).$promise.then(() => {
			this.isDeleting = false;
			$state.go('catalog.manufacturers.index');
		});
	};

	this.removeLogo = (mediaId: number) => {
		this.isRemovingLogo = true;
		const endpoint = `${localized.apiURL}/admin/manufacturers/${this.manufacturer.id}/media/${mediaId}`;
		$http.delete(endpoint).then(() => {
			this.isRemovingLogo = false;
			$state.reload();
		});
	};

	const save = () => {
		this.isSaving = true;
		Manufacturers.save(this.manufacturer).$promise.then((response: any) => {
			const id = response.manufacturer.id;
			this.isSaving = false;
			$state.go('manufacturers.show', { id });
		});
	};

	/**
	 * Select a logo using WP Media.
	 */
	this.selectLogo = () => {
		// eslint-disable-next-line no-undef
		const fileFrame = wp.media({
			title: 'Select or Upload image',
			library: {
				type: 'image',
			},
			button: {
				text: 'Select',
			},
			multiple: false,
		});

		fileFrame.on('select', () => {
			$scope.$apply(function () {
				this.manufacturer.image_url = fileFrame
					.state()
					.get('selection')
					.first()
					.toJSON().url;
			});
		});

		fileFrame.open();
	};

	this.submit = () => {
		if (this.isNew) {
			save();
		} else {
			update();
		}
	};

	/**
	 */
	const update = () => {
		this.isUpdating = true;
		Manufacturers.update(
			{ id: this.manufacturer.id },
			this.manufacturer
		).$promise.then(() => {
			this.isUpdating = false;
			$state.reload();
		});
	};

	/**
	 * @param {Object} manufacturer Manufacturer
	 */
	this.updateBreadcrumb = (manufacturer?: any) => {
		if (manufacturer) {
			this.breadcrumbs.push({
				label: manufacturer.name,
				href: `?page=vendorfuel#!/catalog/manufacturers/${this.manufacturer.id}`,
			});
		} else {
			this.breadcrumbs.push({
				label: 'Add New',
				href: '?page=vendorfuel#!/catalog/manufacturers/create',
			});
		}
	};
}
