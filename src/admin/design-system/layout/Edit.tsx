import React from 'react';

export const Edit = () => {
	return (
		<section className="mb-4">
			<h3>Edit layout</h3>
			<p>
				Each edit page follows a two-column layout which allows for
				field groups and prevents tabs from getting smushed.
			</p>
			<section>
				<div className="mb-3 hstack align-items-baseline">
					<h1>Edit model</h1>
				</div>
				<form>
					<div className="row mb-3">
						<div className="col-md-3">
							<h2 className="h5 form-label">Field group</h2>
							<div className="form-text">
								This is a field group.
							</div>
						</div>
						<div className="col-md-9">
							<div className="mb-3">
								<label
									htmlFor="exampleFormControlInput1"
									className="form-label"
								>
									Email address
								</label>
								<input
									type="email"
									className="form-control"
									id="exampleFormControlInput1"
									placeholder="name@example.com"
								/>
							</div>
							<div className="mb-3">
								<label
									htmlFor="exampleFormControlTextarea1"
									className="form-label"
								>
									Example textarea
								</label>
								<textarea
									className="form-control"
									id="exampleFormControlTextarea1"
									rows="3"
								></textarea>
							</div>
						</div>
					</div>
					<div className="row mb-3">
						<div className="col-md-3">
							<h2 className="h5 form-label">Another group</h2>
							<div className="form-text">
								This is another field group.
							</div>
						</div>
						<div className="col-md-9">
							<div className="mb-3">
								<label
									htmlFor="exampleFormControlInput1"
									className="form-label"
								>
									Email address
								</label>
								<input
									type="email"
									className="form-control"
									id="exampleFormControlInput1"
									placeholder="name@example.com"
								/>
							</div>
							<div className="mb-3">
								<label
									htmlFor="exampleFormControlTextarea1"
									className="form-label"
								>
									Example textarea
								</label>
								<textarea
									className="form-control"
									id="exampleFormControlTextarea1"
									rows="3"
								></textarea>
							</div>
						</div>
					</div>
					<div className="row mb-3">
						<div className="col-md-3">
							<h2 className="h5 form-label">Another group</h2>
							<div className="form-text">
								This is another field group.
							</div>
						</div>
						<div className="col-md-9">
							<nav>
								<div
									className="nav nav-tabs"
									id="nav-tab"
									role="tablist"
								>
									<button
										className="nav-link active"
										id="nav-home-tab"
										data-bs-toggle="tab"
										data-bs-target="#nav-home"
										type="button"
										role="tab"
										aria-controls="nav-home"
										aria-selected="true"
									>
										Home
									</button>
									<button
										className="nav-link"
										id="nav-profile-tab"
										data-bs-toggle="tab"
										data-bs-target="#nav-profile"
										type="button"
										role="tab"
										aria-controls="nav-profile"
										aria-selected="false"
									>
										Profile
									</button>
									<button
										className="nav-link"
										id="nav-contact-tab"
										data-bs-toggle="tab"
										data-bs-target="#nav-contact"
										type="button"
										role="tab"
										aria-controls="nav-contact"
										aria-selected="false"
									>
										Contact
									</button>
									<button
										className="nav-link"
										id="nav-disabled-tab"
										data-bs-toggle="tab"
										data-bs-target="#nav-disabled"
										type="button"
										role="tab"
										aria-controls="nav-disabled"
										aria-selected="false"
										disabled
									>
										Disabled
									</button>
								</div>
							</nav>
							<div
								className="tab-content bg-white border-bottom border-start border-end shadow-sm p-3"
								id="nav-tabContent"
							>
								<div
									className="tab-pane fade show active"
									id="nav-home"
									role="tabpanel"
									aria-labelledby="nav-home-tab"
									tabIndex={0}
								>
									<h3 className="h5">Home</h3>
								</div>
								<div
									className="tab-pane fade"
									id="nav-profile"
									role="tabpanel"
									aria-labelledby="nav-profile-tab"
									tabIndex={0}
								>
									...
								</div>
								<div
									className="tab-pane fade"
									id="nav-contact"
									role="tabpanel"
									aria-labelledby="nav-contact-tab"
									tabIndex={0}
								>
									...
								</div>
								<div
									className="tab-pane fade"
									id="nav-disabled"
									role="tabpanel"
									aria-labelledby="nav-disabled-tab"
									tabIndex={0}
								>
									...
								</div>
							</div>
						</div>
					</div>
					<div className="btn-toolbar gap-1">
						<button className="btn btn-primary">Save</button>
						<button className="btn btn-outline-danger border-0">
							Delete
						</button>
					</div>
				</form>
			</section>
		</section>
	);
};
