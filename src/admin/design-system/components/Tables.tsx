import React from 'react';

export const Tables = () => {
	return (
		<section className="mb-4">
			<h3>Tables</h3>
			<p>
				Tables are to have a white background, light header and shadow
				to stand out from background.
			</p>
			<table className="table bg-white shadow-sm border">
				<thead className="bg-light">
					<tr>
						<th scope="col">#</th>
						<th scope="col">First</th>
						<th scope="col">Last</th>
						<th scope="col">Handle</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<th scope="row">1</th>
						<td>Mark</td>
						<td>Otto</td>
						<td>@mdo</td>
					</tr>
					<tr>
						<th scope="row">2</th>
						<td>Jacob</td>
						<td>Thornton</td>
						<td>@fat</td>
					</tr>
					<tr>
						<th scope="row">3</th>
						<td colSpan={2}>Larry the Bird</td>
						<td>@twitter</td>
					</tr>
				</tbody>
			</table>
		</section>
	);
};
