import template from './group-account.component.html';

interface GroupAccount {
	name: string;
	email: string;
	customer_id: number;
	active: string;
	approver: boolean;
	requestor: boolean;
	admin: boolean;
}

export const GroupAccountComponent: ng.IComponentOptions = {
	template,
	controller: class GroupAccountController {
		static $inject: string[] = ['$location', 'Group', 'User', 'Utils'];
		accounts: GroupAccount[];
		isAdmin: boolean;
		isLoading: boolean;
		isSignedIn: boolean;
		isUpdating: boolean[] = [];
		orderBy: string;
		pageUrls: { login: string; register: string };
		reverseOrderby: boolean;
		userEmail: string;

		constructor(
			private $location: any,
			private Group: any,
			private User: any,
			private Utils: any
		) {
			this.isAdmin = this.User.group_admin;
			this.isSignedIn = this.User.isAuthed && this.User.email;
			this.pageUrls = {
				login: this.Utils.getPageUrl('login', {
					redirect_to: this.$location.path(),
				}),
				register: this.Utils.getPageUrl('register'),
			};
			this.userEmail = this.User.email;
		}

		$onInit() {
			if (this.isAdmin) {
				this.getGroupAccounts();
			}
		}

		changeOrderBy(e: Event, term: string) {
			e.preventDefault();
			if (this.orderBy === term) {
				this.reverseOrderby = !this.reverseOrderby;
			} else {
				this.orderBy = term;
				this.reverseOrderby = false;
			}
		}

		getGroupAccounts() {
			this.isLoading = true;
			this.Group.listGroup()
				.then((response) => response.data)
				.then((data) => {
					this.accounts = data.accounts;
					this.isLoading = false;
				})
				.catch((error) => {
					console.error(error);
				});
		}

		updateAccount(user) {
			this.isUpdating[user.customer_id] = true;
			const params = [
				user.customer_id,
				user.active,
				user.approver,
				user.admin,
				user.requestor,
				user.pending_emails,
			];

			this.Group.changeGroupPermissions(...params).then(() => {
				this.isUpdating[user.customer_id] = false;
			});
		}
	},
};
