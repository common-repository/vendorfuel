import { useQuery } from '@tanstack/react-query';
import { Field, Form, Formik } from 'formik';
import {
	ShippingService,
	Gateways,
} from '../../../features/shipping/shipping-service';
import { Button, Flex, Spinner } from '@wordpress/components';

export const GatewayEdit = () => {
	const { data } = useQuery({
		queryKey: [`gateway`],
		queryFn: ShippingService.indexGateways,
	});

	return (
		<>
			<h1>Shipping Gateway</h1>
			{!data && (
				<Flex justify="center">
					<Spinner />
				</Flex>
			)}
			{data && (
				<Formik
					initialValues={data}
					onSubmit={(values: Gateways, { setSubmitting }) => {
						ShippingService.updateGateways({
							...values,
						}).then(() => {
							setSubmitting(false);
						});
					}}
				>
					{({ isSubmitting }) => (
						<Form>
							<fieldset disabled={isSubmitting}>
								<table
									className="form-table"
									role="presentation"
								>
									<tr>
										<th>
											<label htmlFor="shippo">
												Shippo
											</label>
										</th>
										<td>
											<Field
												id="shippo"
												type="text"
												className="regular-text"
												name="shippo"
											/>
										</td>
									</tr>
								</table>
								<p className="submit">
									<Button
										variant="primary"
										type="submit"
										isBusy={isSubmitting}
									>
										Update
									</Button>
								</p>
							</fieldset>
						</Form>
					)}
				</Formik>
			)}
		</>
	);
};
