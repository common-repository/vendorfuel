import template from './email-page.component.html';
declare let BeePlugin: any;

export const EmailPageComponent: ng.IComponentOptions = {
	template,
	controller: EmailPageController,
};

EmailPageController.$inject = [
	'$scope',
	'$state',
	'Admin',
	'Debug',
	'Utils',
	'EmailsData',
];

function EmailPageController(
	$scope: ng.IScope,
	$state: ng.ui.IStateService,
	Admin: any,
	Debug: any,
	Utils: any,
	EmailsData: any
) {
	let bee: any = null;
	$scope.data = EmailsData.dataEmail();
	$scope.activeTab = 0;
	$scope.loading = false;
	$scope.saving = false;
	$scope.emails = [];
	$scope.emailEndpoint = localized.apiURL + '/admin/email/';
	$scope.selectedEmail = {};
	$scope.emailSettings = {};
	$scope.showPassword = false;
	$scope.shortCodes = [];
	$scope.shortCodesConditional = [];
	$scope.pendingOptions = [];
	$scope.verifiedOptions = [];
	$scope.shipmentOptions = $scope.data.shipmentOptions;
	$scope.shipmentConditionals = $scope.data.shipmentConditionals;
	$scope.checkoutOptions = $scope.data.checkoutOptions;
	$scope.checkoutConditionals = $scope.data.checkoutConditionals;
	$scope.registerOptions = $scope.data.registerOptions;
	$scope.rmaOptions = $scope.data.rmaOptions;
	$scope.isAuthed = Admin.Authed();
	$scope.loadingBee = false;

	$scope.LoginCallback = () => {
		$scope.loading = true;
		//logged in, do something. i.e. make api calls to load current tab's data
	};
	$scope.TransitionState = () => {
		$state.go('email', { activeTab: $scope.activeTab });
	};

	const editEmails = () => {
		const req = {
			method: 'GET',
			url: $scope.emailEndpoint,
		};
		req.url += 'template/';
		Utils.getHttpPromise(req)
			.then(
				(resp: any) => {
					$scope.emailTemplates = resp.email_templates;
				},
				(errResp: Error) => {
					Debug.error(errResp);
				}
			)
			.finally(() => {
				$scope.selectedEmail = $scope.emailTemplates[0];
				$scope.shortCodes = $scope.registerOptions;
				$scope.loading = false;
			});
	};

	const editSettings = () => {
		const req = {
			method: 'GET',
			url: $scope.emailEndpoint,
		};
		req.url += 'mode/';
		Utils.getHttpPromise(req)
			.then(
				(resp: any) => {
					$scope.emailSettings = resp;

					if (typeof $scope.emailSettings.credentials !== 'object') {
						$scope.emailSettings.credentials = {
							mail_host: '',
							mail_pass: '',
							mail_user: '',
						};
					}
				},
				(errResp: Error) => {
					Debug.error(errResp);
				}
			)
			.finally(() => {
				$scope.loading = false;
			});
	};

	$scope.TabChanged = (i: number) => {
		$scope.activeTab = i;
		$scope.loading = true;
		$scope.saving = false;
		$scope.saved = false;

		switch (i) {
			case 0:
				editEmails();
				break;
			case 1:
				editSettings();
				break;
		}
	};
	$scope.SelectTemplate = (email: any) => {
		$scope.selectedEmail = email;
		if ($scope.selectedEmail.type === 'shipment') {
			$scope.shortCodes = $scope.shipmentOptions;
			$scope.shortCodesConditional = $scope.shipmentConditionals;
		}
		if ($scope.selectedEmail.type === 'checkout') {
			$scope.shortCodes = $scope.checkoutOptions;
			$scope.shortCodesConditional = $scope.checkoutConditionals;
		}
		if ($scope.selectedEmail.type === 'rma') {
			$scope.shortCodes = $scope.rmaOptions;
			$scope.shortCodesConditional = [];
		}
		if ($scope.selectedEmail.type === 'register') {
			$scope.shortCodes = $scope.registerOptions;
			$scope.shortCodesConditional = [];
		}
		if ($scope.selectedEmail.type === 'verified') {
			$scope.shortCodes = $scope.verifiedOptions;
			$scope.shortCodesConditional = [];
		}
		if ($scope.selectedEmail.type === 'pending-approval') {
			$scope.shortCodes = $scope.pendingOptions;
			$scope.shortCodesConditional = [];
		}
		const template = JSON.parse(email.json);
		bee.load(JSON.parse(template));
	};

	$scope.UpdateSettings = () => {
		$scope.saving = true;
		const params: any = {
			mode: $scope.emailSettings.mode,
		};
		if ($scope.emailSettings.mode === 'smtp') {
			params.credentials = {
				mail_user: $scope.emailSettings.credentials.mail_user,
				mail_host: $scope.emailSettings.credentials.mail_host,
				mail_pass: $scope.emailSettings.credentials.mail_pass,
			};
		}

		const req = {
			method: 'PUT',
			url: $scope.emailEndpoint + 'mode',
			data: params,
		};
		Utils.getHttpPromise(req)
			.then(
				() => {},
				(errResp: Error) => {
					Debug.error(errResp);
				}
			)
			.finally(() => {
				$scope.loading = false;
				$scope.saving = false;
			});
	};

	$scope.UpdateTemplate = (html: any, json: any) => {
		const params = {
			notification: $scope.selectedEmail.notification_emails,
			sender: $scope.selectedEmail.sender_email,
			name: $scope.selectedEmail.sender_name,
			subject: $scope.selectedEmail.subject,
			message: html,
			json,
		};
		const req = {
			method: 'PUT',
			url: $scope.emailEndpoint + 'template/' + $scope.selectedEmail.type,
			data: params,
		};
		Utils.getHttpPromise(req)
			.then(
				(resp: any) => {
					angular.forEach($scope.emailTemplates, (val, key) => {
						if (val.id === resp.email_template.id) {
							$scope.emailTemplates[key] = resp.email_template;
							$scope.selectedEmail = $scope.emailTemplates[key];
						}
					});
				},
				(errResp: Error) => {
					Debug.error(errResp);
				}
			)
			.finally(() => {
				$scope.loading = false;
				$scope.savingTemplate = false;
			});
	};

	$scope.UploadTemplate = (e: any) => {
		const templateFile = e.files[0];
		const reader = new FileReader();
		reader.onload = () => {
			const templateString = reader.result;
			const template = JSON.parse(templateString);
			bee.load(JSON.parse(template));
		};

		reader.readAsText(templateFile);
	};
	const save = (filename: any, content: any) => {
		saveAs(
			new Blob([content], { type: 'text/plain;charset=utf-8' }),
			filename
		);
	};
	$scope.DownloadHtmlTemplate = () => {
		save($scope.selectedEmail.type + '.html', $scope.selectedEmail.message);
	};
	$scope.DownloadJsonTemplate = () => {
		save($scope.selectedEmail.type + '.json', $scope.selectedEmail.json);
	};
	const request = (
		method: any,
		url: string,
		data: any,
		type: string,
		callback: any
	) => {
		const req = new XMLHttpRequest();
		req.onreadystatechange = () => {
			if (req.readyState === 4 && req.status === 200) {
				const response = JSON.parse(req.responseText);
				callback(response);
			} else if (req.readyState === 4 && req.status !== 200) {
				Debug.error(
					'Access denied, invalid credentials. Please check you entered a valid client_id and client_secret.'
				);
			}
		};
		req.open(method, url, true);
		if (data && type) {
			if (type === 'multipart/form-data') {
				const formData = new FormData();
				for (const [key] of Object.entries(data)) {
					formData.append(key, data[key]);
				}
				data = formData;
			} else {
				req.setRequestHeader('Content-type', type);
			}
		}
		req.send(data);
	};
	const specialLinks = [
		{
			type: 'unsubscribe',
			label: 'SpecialLink.Unsubscribe',
			link: 'http://[unsubscribe]/',
		},
		{
			type: 'subscribe',
			label: 'SpecialLink.Subscribe',
			link: 'http://[subscribe]/',
		},
	];
	const mergeTags = [
		{
			name: 'tag 1',
			value: '[tag1]',
		},
		{
			name: 'tag 2',
			value: '[tag2]',
		},
	];
	const mergeContents = [
		{
			name: 'test',
			value: '[content1]',
		},
		{
			name: 'content 2',
			value: '[content1]',
		},
	];
	/**
	 * @param {any} message Message
	 * @param {any} sample  Sample
	 * @return {Object} JSON
	 */
	function userInput(message: any, sample: any) {
		return (resolve: any, reject: any) => {
			const data = prompt(message, JSON.stringify(sample));
			return data === null || data === ''
				? reject()
				: resolve(JSON.parse(data));
		};
	}
	const beeConfig = {
		uid: $scope.uid,
		container: 'bee-plugin-container',
		autosave: 15,
		language: 'en-US',
		trackChanges: true,
		specialLinks,
		mergeTags,
		mergeContents,
		contentDialog: {
			specialLinks: {
				label: 'Add a custom Special Link',
				handler: userInput('Enter the deep link:', {
					type: 'custom',
					label: 'external special link',
					link: 'http://www.example.com',
				}),
			},
			mergeTags: {
				label: 'Add custom tag 2',
				handler: userInput('Enter the merge tag:', {
					name: 'name',
					value: 'name',
				}),
			},
			mergeContents: {
				label: 'Choose a custom merge content',
				handler: userInput('Enter the merge content:', {
					name: 'my custom content',
					value: '{my-custom-content}',
				}),
			},
			rowDisplayConditions: {
				label: 'Open builder',
				handler: userInput('Enter the row display condition:', {
					type: 'People',
					label: 'Person is a developer',
					description: 'Check if a person is a developer',
					before: "{if job === 'developer'}",
					after: '{endif}',
				}),
			},
		},
		onChange(jsonFile: any, response: any) {
			Debug.log('json', jsonFile);
			Debug.log('response', response);
		},
		onSave(jsonFile: any, htmlFile: any) {
			$scope.savingTemplate = true;
			$scope.json = JSON.stringify(jsonFile);
			$scope.UpdateTemplate(htmlFile, $scope.json);
		},
		onSaveAsTemplate(jsonFile: any) {
			save('newsletter-template.json', jsonFile);
		},
		onAutoSave(jsonFile: any) {
			window.localStorage.setItem('newsletter.autosave', jsonFile);
		},
		onSend(htmlFile: any) {
			//write your send test function here
		},
		onError(errorMessage: any) {
			Debug.error('onError ', errorMessage);
		},
	};
	const getBeeFreeAccessToken = () => {
		if (!$scope.loadingBee) {
			$scope.loadingBee = true;
			const req = {
				method: 'GET',
				url: localized.apiURL + '/admin/beefree/token',
			};
			Utils.getHttpPromise(req)
				.then(
					(resp: any) => {
						$scope.accessToken = resp.access_token;
						$scope.uid = resp.uid;
						beeConfig.uid = $scope.uid;
						$scope.SetupBee($scope.accessToken);
					},
					(errResp: Error) => {
						Debug.error(errResp);
					}
				)
				.finally(() => {});
		}
	};
	$scope.SetupBee = (token: any) => {
		BeePlugin.create(token, beeConfig, (beePluginInstance: any) => {
			bee = beePluginInstance;
			request(
				'GET',
				'https://rsrc.getbee.io/api/templates/m-bee',
				null,
				null,
				() => {
					const template = JSON.parse($scope.selectedEmail.json);
					bee.start(JSON.parse(template));
				}
			);
		});
	};
	getBeeFreeAccessToken();
}
