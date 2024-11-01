import React from 'react';

export const Colors = () => {
	const contexts = [
		'primary',
		'secondary',
		'success',
		'danger',
		'warning',
		'info',
		'light',
		'dark',
	];

	return (
		<>
			<h2>Colors</h2>
			<p>
				Color theme is based on VendorFuel logo colors, using a double
				split complementary harmony. However, the VendorFuel orange is
				only used for the logo and secondary gray color sparingly.
			</p>

			<div className="row row-cols-2 row-cols-md-4 g-3 mb-4">
				<div className="col">
					<div
						className={`card text-capitalize`}
						style={{ backgroundColor: 'var(--bs-orange)' }}
					>
						<div className="card-body pb-5">
							<h4 className="h5 card-title">VendorFuel orange</h4>
							<h5 className="h6">PANTONE 165 C</h5>
						</div>
					</div>
				</div>
				<div className="col">
					<div className={`card text-capitalize text-bg-secondary`}>
						<div className="card-body pb-5">
							<h4 className="h5 card-title">
								VendorFuel warm gray
							</h4>
							<h5 className="h6">PANTONE Warm Gray 11 C</h5>
						</div>
					</div>
				</div>
			</div>

			<div className="row row-cols-2 row-cols-md-4 g-3">
				{contexts.map((context) => (
					<div className="col" key={context}>
						<div
							className={`card text-capitalize text-bg-${context}`}
						>
							<div className="card-body pb-5">
								<h4 className="h5 card-title">{context}</h4>
							</div>
						</div>
					</div>
				))}
			</div>
		</>
	);
};
