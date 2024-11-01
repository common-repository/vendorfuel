import { Component } from '@wordpress/element';
import { DocumentProfile } from './DocumentProfile';

interface State {
	profileId: number;
	isNew: boolean;
}

export class DocumentProfilePage extends Component<
	Record<string, never>,
	State
> {
	constructor(props: Record<string, never>) {
		super(props);
		this.state = {
			profileId: null,
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
			this.setState({ profileId: this.getId(fragment) });
		} else {
			this.setState({ isNew: true });
		}
	}

	render() {
		return (
			<>
				<DocumentProfile
					profileId={this.state.profileId}
					isNew={this.state.isNew}
				/>
			</>
		);
	}
}
