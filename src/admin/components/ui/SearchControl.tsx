import { closeSmall, Icon, search } from '@wordpress/icons';
import {
	Button,
	BaseControl,
	SelectControl,
	Flex,
} from '@wordpress/components';

interface Props {
	handleSubmit: () => void;
	help?: string;
	isBusy?: boolean;
	onChange: (value: string) => void;
	onChangeSearchBy?: (value: string) => void;
	placeholder?: string;
	value?: string;
	searchBy?: string;
	searchByOptions?: {
		label: string;
		value: string;
	}[];
}

export const SearchControl = ({
	help,
	isBusy,
	onChange,
	onChangeSearchBy,
	handleSubmit,
	placeholder,
	searchByOptions,
	value,
}: Props) => {
	const id = `components-search-control`;

	const renderRightButtons = () => {
		return (
			<>
				{value ? (
					<>
						<Button
							icon={search}
							label={`Search for ${value}`}
							type="submit"
							disabled={isBusy}
						/>
						<Button
							icon={closeSmall}
							label={'Reset Search'}
							onClick={() => {
								onChange('');
							}}
							type="reset"
							disabled={isBusy}
						/>
					</>
				) : (
					<Icon icon={search} />
				)}
				{searchByOptions && (
					<SelectControl
						label="Search by"
						onChange={onChangeSearchBy}
						labelPosition="side"
						defaultValue={''}
					>
						<option value="">All</option>
						<optgroup label="Options">
							{searchByOptions.map((option) => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</optgroup>
					</SelectControl>
				)}
			</>
		);
	};

	return (
		<form
			onSubmit={(e: Event) => {
				e.preventDefault();
				handleSubmit();
			}}
			style={{ flex: 'auto' }}
		>
			<fieldset>
				<BaseControl
					id={id}
					label="Search"
					help={help}
					hideLabelFromVision={true}
					className="components-search-control"
				>
					<div className="components-search-control__input-wrapper">
						<input
							className="components-search-control__input"
							id={id}
							type="search"
							placeholder={placeholder}
							value={value || ''}
							autoComplete="off"
							onChange={(event) => onChange(event.target.value)}
							disabled={isBusy}
						/>
						<Flex
							expanded={false}
							style={{
								position: 'absolute',
								right: '12px',
								top: 0,
								bottom: 0,
							}}
						>
							{renderRightButtons()}
						</Flex>
					</div>
				</BaseControl>
			</fieldset>
		</form>
	);
};
