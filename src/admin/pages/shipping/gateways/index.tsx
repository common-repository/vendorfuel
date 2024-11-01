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
						ShippingService.updateGateways({ ...values }).then(
							() => {
								setSubmitting(false);
							}
						);
					}}
				>
					{({ isSubmitting, values, setFieldValue }) => (
						<Form>
							<fieldset disabled={isSubmitting}>
								<h2>Shippo</h2>
								<table
									className="form-table"
									role="presentation"
								>
									<tr>
										<th scope="row">Enabled</th>
										<td>
											<fieldset>
												<legend className="screen-reader-text">
													<span>Enabled</span>
												</legend>
												<label htmlFor="enabled">
													<Field name="shippo.enabled">
														{({
															field,
														}: {
															field: {
																name: string;
																value: number;
															};
														}) => (
															<>
																<input
																	name={
																		field.name
																	}
																	checked={Boolean(
																		field.value
																	)}
																	type="checkbox"
																	onChange={() => {
																		setFieldValue(
																			field.name,
																			field.value
																				? 0
																				: 1
																		);
																	}}
																/>
															</>
														)}
													</Field>{' '}
													Enable Shippo as a shipment
													gateway
												</label>
											</fieldset>
										</td>
									</tr>
									<tr>
										<th>
											<label htmlFor="key">Key</label>
										</th>
										<td>
											<Field
												id="key"
												type="text"
												className="regular-text"
												name="shippo.key"
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
