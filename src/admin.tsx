import { render, StrictMode } from '@wordpress/element';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material';
import { theme } from './admin/shared/theme';
import 'bootstrap-icons/font/bootstrap-icons.scss';
import './admin/admin.scss';
import { router } from './admin/shared/router';
const queryClient = new QueryClient();

render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<ThemeProvider theme={theme}>
				<RouterProvider router={router} />
			</ThemeProvider>
		</QueryClientProvider>
	</StrictMode>,
	document.getElementById('vendorfuel-plugin')
);
