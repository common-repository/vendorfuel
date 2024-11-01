import React from 'react';

export const Pages = () => {
	return (
		<>
			<h2>Pages</h2>
			<section>
				<h3>Headings</h3>
				<p>
					Each page is to start with a header and border underneath.
					Index pages may contain a button for adding new items to
					that index, which is to be adjacent to the heading, similar
					to the WordPress UI. Navigation links are to be placed on
					the far right, with baseline alignment to the heading and
					any button.
				</p>
				<section className="mb-3">
					<div className="pb-2 mb-3 border-bottom hstack align-items-baseline">
						<h1>Plain page</h1>
					</div>
					<p>
						Lorem ipsum dolor sit amet consectetur adipisicing elit.
						Cumque saepe perspiciatis sit voluptate molestias
						repudiandae suscipit molestiae aperiam earum,
						reprehenderit tempore ab similique enim, quibusdam
						exercitationem, eos natus quas assumenda.
					</p>
				</section>
				<section className="mb-3">
					<div className="pb-2 mb-3 border-bottom hstack align-items-baseline gap-2">
						<h1>Page with add button</h1>
						<button className="btn btn-outline-primary btn-sm">
							Add new
						</button>
					</div>
					<p>
						Lorem ipsum dolor sit amet consectetur adipisicing elit.
						Cumque saepe perspiciatis sit voluptate molestias
						repudiandae suscipit molestiae aperiam earum,
						reprehenderit tempore ab similique enim, quibusdam
						exercitationem, eos natus quas assumenda.
					</p>
				</section>
				<section className="mb-3">
					<div className="pb-2 mb-3 border-bottom hstack align-items-baseline gap-2">
						<h1>Page with add button and nav</h1>
						<button className="btn btn-outline-primary btn-sm">
							Add new
						</button>
						<ul className="nav ms-auto">
							<li className="nav-item">
								<a
									className="nav-link active"
									aria-current="page"
									href="#"
								>
									Active
								</a>
							</li>
							<li className="nav-item">
								<a className="nav-link" href="#">
									Link
								</a>
							</li>
							<li className="nav-item">
								<a className="nav-link" href="#">
									Link
								</a>
							</li>
						</ul>
					</div>
					<p>
						Lorem ipsum dolor sit amet consectetur adipisicing elit.
						Cumque saepe perspiciatis sit voluptate molestias
						repudiandae suscipit molestiae aperiam earum,
						reprehenderit tempore ab similique enim, quibusdam
						exercitationem, eos natus quas assumenda.
					</p>
				</section>
			</section>
		</>
	);
};
