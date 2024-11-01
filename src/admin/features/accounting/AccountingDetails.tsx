import { Component } from '@wordpress/element';
import {
	Button,
	Card,
	CardHeader,
	CardBody,
	Spinner,
} from '@wordpress/components';
import { vfAPI } from '../../lib/vfAPI';

interface IState {
	breadcrumbs: { name: string; hash: string }[];
	isBusy: boolean;
	isLoading: boolean;
	quickbooks?: {
		realm_id: string;
		options: {
			'Automatic Bill Export': boolean;
			'Automatic Invoice Export': boolean;
		};
	};
}

const apiUrl = '/accounting/quickbooks';

export class AccountingDetails extends Component<
	Record<string, never>,
	IState
> {
	constructor(props: Record<string, never>) {
		super(props);

		this.state = {
			breadcrumbs: [{ name: 'Accounting', hash: '#!/accounting' }],
			isBusy: false,
			isLoading: true,
		};

		this.handleClickLink = this.handleClickLink.bind(this);
		this.handleClickUnlink = this.handleClickUnlink.bind(this);
	}

	getData() {
		this.setState({ isLoading: true });
		vfAPI.get(apiUrl).then((response) => {
			if (response.data.quickbooks?.realm_id) {
				this.setState({ quickbooks: response.data.quickbooks });
			}
			this.setState({ isBusy: false });
			this.setState({ isLoading: false });
		});
	}

	handleClickLink() {
		this.setState({ isBusy: true });
		vfAPI.get(`${apiUrl}/auth`).then((response) => {
			if (response.data.auth_url) {
				const popup = window.open(
					response.data.auth_url,
					'_blank',
					'location=yes,scrollbars=no,status=no'
				);
				const timer = setInterval(() => {
					if (popup?.closed) {
						clearInterval(timer);
						this.getData();
						this.setState({ isBusy: false });
					}
				}, 1000);
			}
		});
	}

	handleClickUnlink() {
		this.setState({ isBusy: true });
		vfAPI.get(`${apiUrl}/unlink`).then((response) => {
			if (response.data.connected === false) {
				this.setState({ quickbooks: null });
			}
			this.setState({ isBusy: false });
		});
	}

	componentDidMount() {
		this.getData();
	}

	render() {
		return (
			<>
				<Card>
					<CardHeader>QuickBooks</CardHeader>
					<CardBody>
						{this.state.isLoading ? (
							<div className="d-flex justify-content-center">
								<Spinner />
							</div>
						) : (
							<>
								{this.state.quickbooks ? (
									<>
										<table className="widefat striped mb-3">
											<tbody>
												<tr>
													<th scope="row">
														Realm ID
													</th>
													<td>
														{
															this.state
																.quickbooks
																.realm_id
														}
													</td>
												</tr>
												{Object.entries(
													this.state.quickbooks
														.options
												).map((option) => {
													const [key, value] = option;
													return (
														<tr key={key}>
															<th scope="row">
																{key}
															</th>
															<td>
																{value
																	? 'Yes'
																	: 'No'}
															</td>
														</tr>
													);
												})}
											</tbody>
										</table>
										<Button
											isBusy={this.state.isBusy}
											variant="secondary"
											isDestructive
											onClick={this.handleClickUnlink}
										>
											Unlink from QuickBooks
										</Button>
									</>
								) : (
									<>
										<p>
											Click below to link your VendorFuel
											store accounting data to QuickBooks.
										</p>
										<Button
											isBusy={this.state.isBusy}
											variant="primary"
											onClick={this.handleClickLink}
										>
											Link to QuickBooks
										</Button>
									</>
								)}
							</>
						)}
					</CardBody>
				</Card>
			</>
		);
	}
}
