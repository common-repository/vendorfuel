import { Modal } from 'bootstrap';
import template from './select-modal.component.html';

interface Params {
	excludedTable?: string;
	excludedField?: string;
	excludedId?: number;
	page: number;
	perPage: number;
	q: string;
}

export const SelectModal: ng.IComponentOptions = {
	bindings: {
		apiPath: '@',
		excludedField: '@?',
		excludedId: '<?',
		excludedTable: '@?',
		handleSelect: '&',
		idProperty: '@?',
		modelName: '@',
		nameProperty: '@?',
	},
	controller: class Controller {
		static $inject = ['$http'];
		apiPath: string;
		data: any;
		excludedId?: number;
		excludedField?: string;
		excludedTable?: string;
		handleSelect: (params: {
			modelName: string;
			modelIds: number[];
		}) => void;
		idProperty?: string;
		isBusy: boolean;
		modal: Modal;
		modelName: string;
		nameProperty?: string;
		perPage: number = 10;
		q: string = '';
		uuid: string;
		page: number = 1;

		constructor(private $http: ng.IHttpService) {
			this.uuid = crypto.randomUUID();
		}

		$onInit() {
			this.idProperty = this.idProperty || 'id';
			this.nameProperty = this.nameProperty || 'name';
		}

		getData() {
			this.isBusy = true;
			const url = `${localized.apiURL.replace('v1', 'v2')}${
				this.apiPath
			}`;
			const params: Params = {
				page: this.page,
				perPage: this.perPage,
				q: this.q,
			};
			if (this.excludedId) {
				params.excludedId = this.excludedId;
				params.excludedField = this.excludedField;
				params.excludedTable = this.excludedTable;
			}
			return this.$http
				.get(url, { params })
				.then((response) => response.data)
				.then(
					(data: { [modelName: string]: any }) => data[this.modelName]
				)
				.then((data) => (this.data = data))
				.finally(() => (this.isBusy = false));
		}

		handleClick() {
			this.getData();

			this.modal = Modal.getOrCreateInstance(`#selectModal-${this.uuid}`);
			this.modal.show();
		}

		handleClose() {
			const modelIds = this.data.data
				.filter((row: { isChecked: boolean }) => row.isChecked)
				.map(
					(row: { [idProperty: string]: number }) =>
						row[this.idProperty]
				);

			if (modelIds.length) {
				this.handleSelect({ modelName: this.modelName, modelIds });
			}
			this.modal.hide();
		}

		handleChangePage(page: number) {
			this.page = page;
			this.getData();
		}

		handleQuery() {
			this.page = 1;
			this.getData();
		}

		handleResetQuery() {
			this.q = '';
			this.page = 1;
			this.getData();
		}
	},
	template,
};
