import React from 'react';

export const Buttons = () => {
	return (
		<section className="mb-4">
			<h3>Buttons</h3>
			<p>
				Each page is to have only one primary button, with secondary and
				tertiary buttons used in all other cases. Each tab or card on
				page with a primary button should have only one secondary button
				followed by tertiary buttons. Note: the secondary buttons do not
				use the Bootstrap <code>btn-secondary</code> class.
			</p>
			<div className="hstack gap-1 mb-4">
				<button className="btn btn-primary">Primary</button>
				<button className="btn btn-outline-primary">Secondary</button>
				<button className="btn btn-link text-decoration-none">
					Tertiary
				</button>
			</div>
			<h4>Destructive actions</h4>
			<p>
				A destructive action is to use the tertiary destructive button
				which triggers a confirmation. The primary destructive button is
				only to be used for triggering a destroy method on the API.
			</p>
			<div className="hstack gap-1 mb-4">
				<button className="btn btn-danger btn-primary">Primary</button>
				<button className="btn btn-outline-danger">Secondary</button>
				<button className="btn btn-outline-danger border-0">
					Tertiary
				</button>
			</div>
			<h4>Sizes</h4>
			<p>
				All buttons directly on a page are to be the standard size.
				Buttons nested within a tab or adjacent to the page title are to
				be the small size. Only the button used for submitting a login
				is to be large.
			</p>
			<div className="btn-toolbar gap-1 mb-2">
				<button className="btn btn-primary btn-sm">Primary</button>
				<button className="btn btn-outline-primary btn-sm">
					Secondary
				</button>
				<button className="btn btn-link text-decoration-none btn-sm">
					Tertiary
				</button>
			</div>
			<div className="btn-toolbar gap-1 mb-4">
				<button className="btn btn-danger btn-primary btn-sm">
					Primary
				</button>
				<button className="btn btn-outline-danger btn-sm">
					Secondary
				</button>
				<button className="btn btn-outline-danger border-0 btn-sm">
					Tertiary
				</button>
			</div>
			<h4>Input group buttons</h4>
			<p>
				The <code>btn-outline-secondary</code> class is to only be used
				for input groups where the button triggers a search or filter.
			</p>
			<div className="input-group">
				<input type="text" className="form-input" />
				<button className="btn btn-outline-secondary">Button</button>
			</div>
		</section>
	);
};
