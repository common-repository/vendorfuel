import angular from 'angular';
import { react2angular } from 'react2angular';
import { customerAccountsFactory } from './customerAccounts.factory';
import { CustomerEmailService } from './customer-send-email/customer-email.service';
import { CustomerLoginService } from './customer-login/customer-login.service';
import { CustomersService } from './customers.service';
import { CustomerEmailComponent } from './customer-send-email/customer-send-email.component';
import { CustomerLoginComponent } from './customer-login/customer-login.component';
import { CustomerPunchoutTabComponent } from './customer-punchout-tab/customer-punchout-tab.component';
import { CustomerCopyButtonComponent } from './customer-copy-button/customer-copy-button.component';
import { CustomerAddressModalComponent } from './customer-address-modal/customer-address-modal.component';
import { AccountEdit } from './account-edit.component';
import { AccountsSettings } from './accounts-settings.component';
import { AccountUploadCreate } from '../../../customers/accounts/uploads/AccountUploadCreate';
import { CustomerShipping } from './CustomerShipping';
import { searchModalFactory } from '../../../shared/modal/search-modal.factory';
import { AccountNotes } from './AccountNotes';

export const AccountsModule = angular
	.module('AccountsModule', [])
	.service('CustomerEmailService', CustomerEmailService)
	.service('CustomerLoginService', CustomerLoginService)
	.service('CustomersService', CustomersService)
	.factory('customerAccountsService', customerAccountsFactory)
	.component('accountNotes', react2angular(AccountNotes))
	.component('accountsSettings', AccountsSettings)
	.component('accountEdit', AccountEdit)
	.component('customerAddressModal', CustomerAddressModalComponent)
	.component('customerCopyButton', CustomerCopyButtonComponent)
	.component('customerLogin', CustomerLoginComponent)
	.component('customerSendEmail', CustomerEmailComponent)
	.component('customerPunchoutTab', CustomerPunchoutTabComponent)
	.component('customerShipping', react2angular(CustomerShipping)).name;
