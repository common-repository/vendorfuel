import { Grid, TextField } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useQuery } from '@tanstack/react-query';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { ShippingService } from '../../features/shipping/shipping-service';
import { Layout } from '../../layout/Layout';
import { Spinner } from '../../components/spinner/Spinner';
import { Warehouse } from './Warehouse';

export const WarehouseEdit = () => {
	const parent = { label: 'Shipping', to: '..' };

	const { data } = useQuery({
		queryKey: [`warehouse`],
		queryFn: () => {
			return ShippingService.indexWarehouse().then((response) => {
				if (response.warehouse) {
					return response.warehouse;
				}
				return new Warehouse();
			});
		},
	});

	const validationSchema = Yup.object().shape({
		street1: Yup.string().required('The street address is required.'),
		city: Yup.string().required('The city is required.'),
		state: Yup.string().required('The state is required.'),
		zip: Yup.string().required('The zip code is required.'),
	});

	return (
		<Layout heading="Warehouse" parent={parent}>
			{!data && <Spinner />}
			{data && (
				<Formik
					initialValues={data}
					onSubmit={(values, { setSubmitting }) => {
						ShippingService.updateWarehouse({ ...values }).then(
							() => {
								setSubmitting(false);
							}
						);
					}}
					validationSchema={validationSchema}
				>
					{({ isSubmitting, errors, touched }) => (
						<Form>
							<fieldset disabled={isSubmitting}>
								<Grid container spacing={2}>
									<Grid item xs={12}>
										<Field
											as={TextField}
											label="Street Address"
											name="street1"
											error={errors.street1}
											helperText={
												errors.street1 &&
												touched.street1
													? errors.street1
													: null
											}
										/>
									</Grid>
									<Grid item xs={12}>
										<Field
											as={TextField}
											label="City"
											name="city"
											error={errors.city}
											helperText={
												errors.city && touched.city
													? errors.city
													: null
											}
										/>
									</Grid>
									<Grid item xs={12}>
										<Field
											as={TextField}
											label="State"
											name="state"
											error={errors.state}
											helperText={
												errors.state && touched.state
													? errors.state
													: null
											}
										/>
									</Grid>
									<Grid item xs={12}>
										<Field
											as={TextField}
											label="Zip Code"
											name="zip"
											error={errors.zip}
											helperText={
												errors.zip && touched.zip
													? errors.zip
													: null
											}
										/>
									</Grid>
									<Grid item xs={12}>
										<LoadingButton
											variant="contained"
											type="submit"
											loading={isSubmitting}
										>
											Update
										</LoadingButton>
									</Grid>
								</Grid>
							</fieldset>
						</Form>
					)}
				</Formik>
			)}
		</Layout>
	);
};
