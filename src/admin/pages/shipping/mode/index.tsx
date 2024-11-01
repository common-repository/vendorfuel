import { useQuery } from '@tanstack/react-query';
import { Form, Formik } from 'formik';
import { toast } from 'react-toastify';
import {
	FormControl,
	FormLabel,
	Radio,
	RadioGroup,
	FormControlLabel,
	Grid,
} from '@mui/material';
import { ShippingService } from '../../../features/shipping/shipping-service';
import { Layout } from '../../../components/ui/layout/layout';
import { LoadingButton } from '@mui/lab';

export const ModeEdit = () => {
	const { data, isFetching } = useQuery({
		queryKey: ['mode'],
		queryFn: ShippingService.getMode,
		initialData: '',
	});

	const parent = { label: 'Shipping', to: '..' };

	return (
		<Layout heading="Shipping mode" parent={parent}>
			<Formik
				enableReinitialize
				initialValues={{ mode: data }}
				onSubmit={(values) =>
					ShippingService.update(values.mode).then((mode) =>
						toast.info(
							`Shipping mode updated to ${mode.replace(
								'_',
								' '
							)}.`,
							{
								icon: false,
							}
						)
					)
				}
			>
				{({ values, setFieldValue, isSubmitting }) => (
					<Form>
						<FormControl
							component="fieldset"
							disabled={isFetching || isSubmitting}
						>
							<FormLabel component="legend">
								Shipping mode
							</FormLabel>
							<Grid container spacing={2}>
								<Grid item xs={12}>
									<RadioGroup
										name="mode"
										value={values.mode}
										onChange={(event) => {
											setFieldValue(
												'mode',
												event.currentTarget.value
											);
										}}
									>
										<FormControlLabel
											value="free"
											control={<Radio />}
											label="Free"
										/>
										<FormControlLabel
											value="rate"
											control={<Radio />}
											label="Rate"
										/>
										<FormControlLabel
											value="parcel"
											control={<Radio />}
											label="Parcel"
										/>
									</RadioGroup>
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
						</FormControl>
					</Form>
				)}
			</Formik>
		</Layout>
	);
};
