import angular from 'angular';
import * as bootstrap from 'bootstrap';
import { AdminModule } from './admin/admin.module';
import './admin/admin.scss';
import 'bootstrap-icons/font/bootstrap-icons.scss';
import './sass/legacy.scss';

document.addEventListener('DOMContentLoaded', () => {
	const el = document.getElementById('vendorfuel-plugin');
	if (el) {
		angular.bootstrap(el, [AdminModule]);
	}
});
