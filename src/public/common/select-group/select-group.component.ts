import template from './select-group.component.html';

const SelectGroupComponent: ng.IComponentOptions = {
	template,
	bindings: {
		onChange: '&',
	},
	controller: class Controller {
		static $inject = ['User'];
		currentGroupId: number;
		groupOptions: unknown[];
		onChange: any;

		// eslint-disable-next-line no-useless-constructor
		constructor(private User: any) {}

		$onInit() {
			this.currentGroupId = this.User.currentGroup_id;
			if (typeof this.User.group === 'object') {
				this.groupOptions = Object.values(this.User.group);
			}
		}

		changeGroup(id: number) {
			this.User.updateGroup(id);
			this.onChange({});
		}
	},
};

export default SelectGroupComponent;
