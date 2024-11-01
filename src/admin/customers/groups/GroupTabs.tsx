import PropTypes from 'prop-types';
import { GroupCustomers } from './GroupCustomers';
import { GroupNotes } from './GroupNotes';
import { GroupRates } from './GroupRates';
import { GroupPunchout } from './GroupPunchout';
import { GroupChildGroups } from './GroupChildGroups';

export const GroupTabs = (props) => {
	return (
		<>
			{props.group && (
				<>
					<ul className="nav nav-tabs" id="myTab" role="tablist">
						<li className="nav-item" role="presentation">
							<button
								className="nav-link active"
								id="customers-tab"
								data-bs-toggle="tab"
								data-bs-target="#customers-tab-pane"
								type="button"
								role="tab"
								aria-controls="customers-tab-pane"
								aria-selected="true"
							>
								Customers
							</button>
						</li>
						<li className="nav-item" role="presentation">
							<button
								className="nav-link"
								id="child-groups-tab"
								data-bs-toggle="tab"
								data-bs-target="#child-groups-tab-pane"
								type="button"
								role="tab"
								aria-controls="child-groups-tab-pane"
								aria-selected="false"
							>
								Child Groups
							</button>
						</li>
						<li className="nav-item" role="presentation">
							<button
								className="nav-link"
								id="rates-tab"
								data-bs-toggle="tab"
								data-bs-target="#rates-tab-pane"
								type="button"
								role="tab"
								aria-controls="rates-tab-pane"
								aria-selected="false"
							>
								Shipping Rates
							</button>
						</li>
						<li className="nav-item" role="presentation">
							<button
								className="nav-link"
								id="punchout-tab"
								data-bs-toggle="tab"
								data-bs-target="#punchout-tab-pane"
								type="button"
								role="tab"
								aria-controls="punchout-tab-pane"
								aria-selected="false"
							>
								Punchout
							</button>
						</li>
						<li className="nav-item" role="presentation">
							<button
								className="nav-link"
								id="notes-tab"
								data-bs-toggle="tab"
								data-bs-target="#notes-tab-pane"
								type="button"
								role="tab"
								aria-controls="notes-tab-pane"
								aria-selected="false"
							>
								Notes
							</button>
						</li>
					</ul>
					<div
						className="tab-content bg-white border-bottom border-start border-end shadow-sm p-3"
						id="myTabContent"
					>
						<div
							className="tab-pane fade show active"
							id="customers-tab-pane"
							role="tabpanel"
							aria-labelledby="customers-tab"
						>
							<GroupCustomers
								groupId={props.group.group_id}
								customers={props.group.customers}
								handleUpdate={props.handleUpdate}
								handleChangePage={props.handleChangePage}
							/>
						</div>
						<div
							className="tab-pane fade"
							id="child-groups-tab-pane"
							role="tabpanel"
							aria-labelledby="child-groups-tab"
						>
							<GroupChildGroups
								childGroups={props.group.child_groups}
							/>
						</div>
						<div
							className="tab-pane fade"
							id="rates-tab-pane"
							role="tabpanel"
							aria-labelledby="rates-tab"
						>
							<GroupRates
								groupId={props.group.group_id}
								handleUpdate={props.handleUpdate}
								rates={props.group.flatrates}
							/>
						</div>
						<div
							className="tab-pane fade"
							id="punchout-tab-pane"
							role="tabpanel"
							aria-labelledby="punchout-tab"
						>
							<GroupPunchout
								groupId={props.group.group_id}
								handleUpdate={props.handleUpdate}
								profiles={props.group.punchout_profiles}
							/>
						</div>
						<div
							className="tab-pane fade"
							id="notes-tab-pane"
							role="tabpanel"
							aria-labelledby="notes-tab"
						>
							<GroupNotes groupId={props.group.group_id} />
						</div>
					</div>
				</>
			)}
		</>
	);
};

GroupTabs.propTypes = {
	group: PropTypes.object, // Paginated customers object.
	handleUpdate: PropTypes.func, // Callback to trigger refreshing parent component.
	handleChangePage: PropTypes.func, // Callback for sending updated page number to parent component.
};
