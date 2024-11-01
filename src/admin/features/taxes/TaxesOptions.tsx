import { Component } from '@wordpress/element';
import { Button, FormTokenField } from '@wordpress/components';
import { stateOptions } from './stateOptions';
import { vfAPI } from '../../shared/vfAPI';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {}

interface State {
	isBusy: boolean;
	taxStates: string[];
	taxStateNames: string[];
}

const stateNames = stateOptions.map((state) => state.name);
const stateValues = stateOptions.map((state) => state.value);
const url = `${localized.apiURL}/admin/tax-states`;

export class TaxesOptions extends Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			isBusy: false,
			taxStates: [],
			taxStateNames: [],
		};

		this.addAllStates = this.addAllStates.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.removeAllStates = this.removeAllStates.bind(this);
		this.setSelectedStates = this.setSelectedStates.bind(this);
	}

	componentDidMount() {
		this.getData();
	}

	addAllStates() {
		this.setState({ taxStates: stateValues });
		this.setState({ taxStateNames: stateNames });
	}

	getData() {
		this.setState({ isBusy: true });
		vfAPI.get(url).then((response) => {
			if (response.data.tax_states) {
				this.setState({ taxStates: response.data.tax_states });
				this.setState({
					taxStateNames: this.getStateNames(response.data.tax_states),
				});
				this.setState({ isBusy: false });
			}
		});
	}

	getStateNames(values: string[]): string[] {
		return values.map((value) => {
			return stateOptions.find((state) => state.value === value).name;
		});
	}

	getStateValues(tokens: string[]): string[] {
		return tokens.map((token) => {
			return stateOptions.find((state) => state.name === token).value;
		});
	}

	handleSubmit(e) {
		e.preventDefault();
		this.setState({ isBusy: true });
		const data = {
			state_id: this.state.taxStates,
		};
		vfAPI.post(url, data).then((response) => {
			if (response.data.success) {
				this.setState({ isBusy: false });
			}
		});
	}

	removeAllStates() {
		this.setState({ taxStates: [] });
		this.setState({ taxStateNames: [] });
	}

	setSelectedStates(tokens: string[]) {
		const allowedTokens = tokens.filter((token) =>
			stateNames.includes(token)
		);
		this.setState({ taxStateNames: allowedTokens });
		this.setState({ taxStates: this.getStateValues(allowedTokens) });
	}

	render() {
		return (
			<>
				<h2 className="h5 my-3">Options</h2>
				<form onSubmit={this.handleSubmit}>
					<fieldset disabled={this.state.isBusy}>
						<table className="form-table" role="presentation">
							<tbody>
								<th scope="row">
									States to collect taxes from
								</th>
								<td>
									<FormTokenField
										value={this.state.taxStateNames}
										suggestions={stateNames}
										onChange={(tokens) =>
											this.setSelectedStates(tokens)
										}
										placeholder="California, Oklahoma, District of Columbia, etc."
									/>
								</td>
							</tbody>
						</table>
						<div className="btn-toolbar justify-content-between gap-1">
							<Button
								isBusy={this.state.isBusy}
								type="submit"
								variant="primary"
							>
								Update
							</Button>
							<div className="hstack gap-1">
								<Button
									isBusy={this.state.isBusy}
									onClick={this.addAllStates}
									variant="secondary"
								>
									Add All States
								</Button>
								<Button
									isBusy={this.state.isBusy}
									isDestructive
									onClick={this.removeAllStates}
									variant="tertiary"
								>
									Remove All States
								</Button>
							</div>
						</div>
					</fieldset>
				</form>
			</>
		);
	}
}
