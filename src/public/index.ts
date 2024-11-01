import angular from 'angular';
import * as bootstrap from 'bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.scss';
import './public.scss';
import './public.module';
import './common';
import './components';

document.addEventListener('DOMContentLoaded', () => {
	angular.bootstrap(document, ['vfApp']);
});
