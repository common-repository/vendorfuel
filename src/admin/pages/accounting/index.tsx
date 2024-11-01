import { Component } from '@wordpress/element';
import { Spinner } from '../../components/spinner/Spinner';
import { vfApi } from '../../lib/vf-api';

interface IState {
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

export class AccountingPage extends Component<Record<string, never>, IState> {
	constructor(props: Record<string, never>) {
		super(props);

		this.state = {
			isBusy: false,
			isLoading: true,
		};

		this.handleClickLink = this.handleClickLink.bind(this);
		this.handleClickUnlink = this.handleClickUnlink.bind(this);
	}

	getData() {
		this.setState({ isLoading: true });
		vfApi.get(apiUrl).then((response) => {
			if (response.data.quickbooks?.realm_id) {
				this.setState({ quickbooks: response.data.quickbooks });
			}
			this.setState({ isBusy: false });
			this.setState({ isLoading: false });
		});
	}

	handleClickLink() {
		this.setState({ isBusy: true });
		vfApi.get(`${apiUrl}/auth`).then((response) => {
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
		vfApi.get(`${apiUrl}/unlink`).then((response) => {
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
				{this.state.isLoading ? (
					<Spinner />
				) : (
					<>
						<h2>Accounting</h2>
						{this.state.quickbooks ? (
							<>
								<table className="table bg-white mb-3">
									<tbody>
										<tr>
											<th scope="row">Realm ID</th>
											<td>
												{this.state.quickbooks.realm_id}
											</td>
										</tr>
										{Object.entries(
											this.state.quickbooks.options
										).map((option) => {
											const [key, value] = option;
											return (
												<tr key={key}>
													<th scope="row">{key}</th>
													<td>
														{value ? 'Yes' : 'No'}
													</td>
												</tr>
											);
										})}
									</tbody>
								</table>
								<button
									disabled={this.state.isBusy}
									onClick={this.handleClickUnlink}
									className="btn btn-outline-danger border-0"
								>
									Unlink from QuickBooks
								</button>
							</>
						) : (
							<>
								<p>
									Click below to link your VendorFuel store
									accounting data to QuickBooks.
								</p>
								<button
									disabled={this.state.isBusy}
									onClick={this.handleClickLink}
									className="btn btn-primary"
								>
									Link to QuickBooks
								</button>
							</>
						)}
					</>
				)}
			</>
		);
	}
}
