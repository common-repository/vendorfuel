import { toast } from 'react-toastify';

interface Data {
	errors: string[];
	warnings: string[];
	notifications: string[];
}

export const handleNotifications = (data: Data) => {
	const { errors, warnings, notifications } = data;
	if (errors) {
		errors.forEach((content) =>
			toast.error(content, {
				autoClose: false,
			})
		);
	}
	if (warnings) {
		warnings.forEach((content) =>
			toast.warning(content, {
				autoClose: 7000,
			})
		);
	}
	if (notifications) {
		notifications.forEach((content) =>
			toast.info(content, {
				icon: false,
			})
		);
	}
};
