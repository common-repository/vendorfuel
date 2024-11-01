import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

export const DesignSystem = () => {
	const navItems = [
		{ label: 'Colors', path: 'colors' },
		{ label: 'Components', path: 'components' },
		{ label: 'Forms', path: 'forms' },
		{ label: 'Pages', path: 'pages' },
		{ label: 'Sections', path: 'sections' },
		{ label: 'Layout', path: 'layout' },
	];

	return (
		<>
			<div className="pb-2 mb-3 border-bottom hstack align-items-baseline">
				<h1>Design system</h1>
				<ul className="nav ms-auto">
					{navItems.map((item) => (
						<li className="nav-item" key={item.path}>
							<NavLink className="nav-link" to={`./${item.path}`}>
								{item.label}
							</NavLink>
						</li>
					))}
				</ul>
			</div>
			<section>
				<Outlet />
			</section>
		</>
	);
};
