import template from './welcome-banner.html';

export const WelcomeBannerComponent: ng.IComponentOptions = {
	template,
	controller: class WelcomeBannerController {
		static $inject: string[] = ['User'];
		isLoading: boolean;
		banner: string;
		// eslint-disable-next-line no-useless-constructor
		constructor(private User: any) {}

		$onInit() {
			this.getBanner();
		}

		getBanner() {
			this.isLoading = true;
			const area = 'Welcome screen';

			this.User.getBanner(area)
				.then((response) => response.data)
				.then((data) => {
					this.banner = data.content;
					this.isLoading = false;
				});
		}
	},
};
