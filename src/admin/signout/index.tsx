import { render, StrictMode } from '@wordpress/element';
import { SignoutPage } from './SignoutPage';

render(
	<StrictMode>
		<SignoutPage />
	</StrictMode>,
	document.getElementById('vendorfuel-plugin')
);
