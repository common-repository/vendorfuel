import { render } from '@wordpress/element';
import { DashboardPage } from '../../pages/DashboardPage';
import './dashboard.scss';

render(
	<DashboardPage />,
	document.getElementById( 'vendorfuel-plugin' ),
);
