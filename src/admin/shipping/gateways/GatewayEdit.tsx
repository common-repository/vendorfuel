import { Grid, TextField } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useQuery } from '@tanstack/react-query';
import { Field, Form, Formik } from 'formik';
import { ShippingService } from '../ShippingService';
import { Layout } from '../../layout/Layout';
import { Spinner } from '../../components/spinner/Spinner';

export const GatewayEdit = () => {
	const parent = { label: 'Shipping', to: '..' };

	const { data } = useQuery({
		queryKey: [`gateway`],
		queryFn: ShippingService.indexGateways,
	});

	return (
		<Layout heading="Gateway" parent={parent}>
			{!data && <Spinner />}
			{data && (
				<Formik
					initialValues={data}
					onSubmit={(values, { setSubmitting }) => {
						ShippingService.updateGateways({ ...values }).then(
							() => {
								setSubmitting(false);
							}
						);
					}}
				>
					{({ isSubmitting }) => (
						<Form>
							<Grid container spacing={2}>
								<Grid item xs={12}>
									<Field
										as={TextField}
										label="Shippo"
										name="shippo"
										disabled={isSubmitting}
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
						</Form>
					)}
				</Formik>
			)}
		</Layout>
	);
};
