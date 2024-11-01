import { render, StrictMode } from '@wordpress/element';
import { NavBar } from '../shared/NavBar';
import { AccountingPage } from './AccountingPage';
import { ThemeProvider } from '@mui/material';
import { theme } from '../shared/theme';

render(
	<StrictMode>
		<ThemeProvider theme={theme}>
			<NavBar />
			<AccountingPage />
		</ThemeProvider>
	</StrictMode>,
	document.getElementById('vendorfuel-plugin')
);
