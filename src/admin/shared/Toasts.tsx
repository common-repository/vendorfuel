import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Toasts = () => {
	return (
		<ToastContainer
			newestOnTop
			pauseOnFocusLoss
			pauseOnHover
			position={toast.POSITION.BOTTOM_RIGHT}
			theme="dark"
		/>
	);
};
