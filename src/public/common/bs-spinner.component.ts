(function () {
	'use strict';

	const template = `
        <div class="d-flex justify-content-center">
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
	`;

	angular.module('vfApp').component('bsSpinner', {
		template,
	});
})();
