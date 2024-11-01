import { render, StrictMode } from '@wordpress/element';
import { AccountingPage } from '../../pages/accounting';

render(
	<StrictMode>
		<AccountingPage />
	</StrictMode>,
	document.getElementById('vendorfuel-app')
);
