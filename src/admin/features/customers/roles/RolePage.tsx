import { Component } from '@wordpress/element';
import { RoleEdit } from './RoleEdit';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {}

interface State {
	roleId: number;
	isNew: boolean;
}

export class RolePage extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			roleId: null,
			isNew: false,
		};
	}

	isId(value: string): boolean {
		return Number.isInteger(Number(value));
	}

	getId(value: string): number {
		return Number(value);
	}

	componentDidMount() {
		const fragment = location.hash.split('/').pop();
		if (this.isId(fragment)) {
			this.setState({ roleId: this.getId(fragment) });
		} else {
			this.setState({ isNew: true });
		}
	}

	render() {
		return (
			<>
				<RoleEdit roleId={this.state.roleId} isNew={this.state.isNew} />
			</>
		);
	}
}
