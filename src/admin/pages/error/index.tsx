import { useRouteError } from 'react-router-dom';

export const ErrorPage = () => {
	const error = useRouteError() as {
		data?: unknown;
		status: number;
		statusText?: string;
		message?: string;
	};

	return (
		<div className="alert alert-danger">
			<h2 className="h4 alert-heading">{error.status} Error</h2>
			<p>
				Sorry, an unexpected error has occurred:{' '}
				{error.statusText || error.message}
			</p>
		</div>
	);
};
