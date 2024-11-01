import { render, StrictMode } from '@wordpress/element';
import { SignoutPage } from '../../pages/signout';

render(
	<StrictMode>
		<SignoutPage />
	</StrictMode>,
	document.getElementById('vendorfuel-app')
);
