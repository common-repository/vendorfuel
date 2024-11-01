import template from './address-index.component.html';
import { usStates } from '../../../common/us-states';

export const AddressIndexComponent: ng.IComponentOptions = {
	template,
	controller: class AddressIndexController {
		static $inject = ['$location', 'User', 'Utils'];
		pageUrls: { login: string; register: string };
		isSignedIn: boolean;
		isEditingProfile = {
			billing: false,
			shipping: false,
		};
		profile: {
			firstName: string;
			lastName: string;
			email: string;
			address1: string;
			address2: string;
			city: string;
			state: { name: string; id: string };
			zip: string;
			phone: string;
			profileId: number;
			profileName: string;
		} | null;
		isLoading: boolean;
		hasLockedBilling: boolean;
		hasLockedShipping: boolean;
		profiles: {
			billing: unknown[];
			shipping: unknown[];
		};
		defaultProfiles: {
			billing: unknown;
			shipping: unknown;
		};
		defaultBillingProfileId: number;
		defaultShippingProfileId: number;
		isMakingDefault: boolean[] = [];
		isConfirmingDeletion: boolean[] = [];
		isRemoving: boolean[] = [];

		// eslint-disable-next-line no-useless-constructor
		constructor(
			private $location: ng.ILocationService,
			private User: any,
			private Utils: any
		) {}

		$onInit() {
			this.defaultBillingProfileId = this.User.defaultBillingProfile;
			this.defaultShippingProfileId = this.User.defaultShippingProfile;
			this.pageUrls = {
				login: this.Utils.getPageUrl('login', {
					redirect_to: this.$location.path(),
				}),
				register: this.Utils.getPageUrl('register'),
			};
			this.isSignedIn = this.User.isAuthed && this.User.email;

			if (this.isSignedIn) {
				this.getProfiles();
			}
		}

		editProfile(profile, type) {
			this.profile = {
				firstName: profile.first_name,
				lastName: profile.last_name,
				email: profile.email,
				address1: profile.address1,
				address2: profile.address2 || null,
				city: profile.city,
				state: Object.values(usStates).find(
					(state) => state.id === profile.state.toLocaleUpperCase()
				),
				zip: profile.zip,
				phone: profile.phone,
				profileId: profile.billing_id || profile.shipping_id,
				profileName: profile.billing_name || profile.shipping_name,
			};
			this.isEditingProfile[type] = true;
		}

		getProfiles() {
			this.isLoading = true;
			this.isEditingProfile.billing = false;
			this.isEditingProfile.shipping = false;
			this.User.getProfiles()
				.then((response) => {
					this.hasLockedBilling = response.data.lock_billing;
					this.hasLockedShipping = response.data.lock_shipping;
					this.profiles = {
						billing: Object.values(response.data.billing_addresses),
						shipping: Object.values(
							response.data.shipping_addresses
						),
					};
					this.defaultProfiles = {
						billing: this.profiles.billing.find(
							(profile) =>
								profile.billing_id ===
								this.defaultBillingProfileId
						),
						shipping: this.profiles.shipping.find(
							(profile) =>
								profile.shipping_id ===
								this.defaultShippingProfileId
						),
					};
				})
				.catch((reject) => {
					console.error(reject);
				})
				.finally(() => {
					this.isLoading = false;
				});
		}

		onClickCreate(type) {
			this.profile = null;
			this.isEditingProfile[type] = true;
		}

		onClickEdit(profile, type: 'billing' | 'shipping') {
			this.editProfile(profile, type);
		}

		onClickMakeDefault(id: number, type: 'billing' | 'shipping') {
			this.isMakingDefault[id] = true;
			this.User.setDefaultProfile(id, type).then(() => {
				this.getProfiles();
				if (type === 'billing') {
					this.defaultBillingProfileId = id;
				} else {
					this.defaultShippingProfileId = id;
				}
				this.isMakingDefault[id] = false;
			});
		}

		onClickRemove = (id: number, type: 'billing' | 'shipping') => {
			this.isRemoving[id] = true;

			if (type === 'billing') {
				this.User.removeBillingProfile(id).then(() => {
					this.getProfiles();
					this.isRemoving[id] = false;
				});
			} else if (type === 'shipping') {
				this.User.removeShippingProfile(id).then(() => {
					this.getProfiles();
					this.isRemoving[id] = false;
				});
			}
		};
	},
};
