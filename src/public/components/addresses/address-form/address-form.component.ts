import template from './address-form.html';
import { IState, usStates } from '../../../common/us-states';
import { emailPattern } from '../../../common/patterns';
import { zipCodePattern } from '../../../../admin/shared/zipCodePattern';

export const AddressFormComponent: ng.IComponentOptions = {
	bindings: {
		type: '@?',
		profile: '<',
	},
	require: {
		addressListController: '^addressIndex',
	},
	template,
	controller: class AddressFormController {
		static $inject = ['User'];

		public emailPattern: RegExp;
		public zipCodePattern: RegExp;
		public stateOptions: IState[];
		addressListController: any;
		type?: string;
		profile: {
			firstName?: string;
			lastName?: string;
			email?: string;
			address1?: string;
			address2?: string;
			city?: string;
			state?: {
				id?: string;
			};
			zip?: string;
			phone?: string;
			profileName?: string;
			profileId?: number;
		};
		isInProgress: boolean;

		constructor(private User: any) {
			this.emailPattern = emailPattern;
			this.zipCodePattern = zipCodePattern;
			this.stateOptions = usStates;
		}

		cancel() {
			this.addressListController.isEditingProfile[this.type] = false;
		}

		closeForm = () => {
			this.addressListController.getProfiles();
			this.profile = {};
			this.isInProgress = false;
		};

		onSubmit() {
			this.isInProgress = true;
			const profileForm: {
				first_name: string;
				last_name: string;
				email: string;
				address1: string;
				address2?: string;
				city: string;
				state: string;
				zip: string;
				phone: string;
				billing_id?: number;
				billing_name?: string;
				shipping_id?: number;
				shipping_name?: string;
			} = {
				first_name: this.profile.firstName,
				last_name: this.profile.lastName,
				email: this.profile.email,
				address1: this.profile.address1,
				address2: this.profile.address2 || null,
				city: this.profile.city,
				state: this.profile.state.id.toLocaleUpperCase(),
				zip: this.profile.zip,
				phone: this.profile.phone,
			};

			if (this.type === 'billing') {
				profileForm.billing_id = this.profile.profileId || null;
				profileForm.billing_name = this.profile.profileName || null;
				this.User.addBillingProfile(profileForm)
					.then((response) => {
						if (!response.data.errors.length) {
							this.closeForm();
						}
					})
					.catch((reject) => {
						console.error(reject);
					})
					.finally(() => {
						this.isInProgress = false;
					});
			} else if (this.type === 'shipping') {
				profileForm.shipping_id = this.profile.profileId || null;
				profileForm.shipping_name = this.profile.profileName || null;
				this.User.addShippingProfile(profileForm)
					.then((response) => {
						if (!response.data.errors.length) {
							this.closeForm();
						}
					})
					.catch((reject) => {
						console.error(reject);
					})
					.finally(() => {
						this.isInProgress = false;
					});
			}
		}
	},
};
