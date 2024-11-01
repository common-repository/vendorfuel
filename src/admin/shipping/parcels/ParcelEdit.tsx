import {
	FormControlLabel,
	FormLabel,
	Grid,
	InputAdornment,
	Radio,
	RadioGroup,
	TextField,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useQuery } from '@tanstack/react-query';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Layout } from '../../layout/Layout';
import { Spinner } from '../../components/spinner/Spinner';
import { useNavigate, useParams } from 'react-router-dom';
import { ParcelService } from './ParcelService';
import { Parcel } from './Parcel';

export const ParcelEdit = () => {
	const parent = { label: 'Parcels', to: '..' };
	const radioOptions = [
		{ label: 'Inches', value: 'in' },
		{ label: 'Centimeters', value: 'cm' },
	];

	const inputProps = (values) => {
		return {
			endAdornment: (
				<InputAdornment position="start">
					{values.distance_unit}
				</InputAdornment>
			),
		};
	};

	const { id } = useParams();
	const navigate = useNavigate();

	const { data, isLoading } = useQuery({
		queryKey: [`parcel-${id}`],
		queryFn: () => ParcelService.show(id),
		enabled: !!id,
	});

	const validationSchema = Yup.object().shape({
		title: Yup.string().required('Name is required.'),
		length: Yup.number().required('Length is required.').min(0),
		width: Yup.number().required('Width is required.').min(0),
		height: Yup.number().required('Height is required.').min(0),
		distance_unit: Yup.string().required('Distance unit is required.'),
	});

	return (
		<Layout heading={`${id ? 'Edit' : 'Add new'} parcel`} parent={parent}>
			{id && isLoading && <Spinner />}
			{(data || !id) && (
				<Formik
					initialValues={id ? data : new Parcel()}
					onSubmit={(values, { setSubmitting }) => {
						if (id) {
							ParcelService.update(id, { ...values }).then(() => {
								setSubmitting(false);
							});
						} else {
							ParcelService.store({ ...values }).then(
								(response) => {
									if (response.id) {
										navigate(`../${response.id}`);
									}
									setSubmitting(false);
								}
							);
						}
					}}
					validationSchema={validationSchema}
				>
					{({ isSubmitting, errors, touched, values }) => (
						<Form>
							<fieldset disabled={isSubmitting}>
								<Grid container spacing={2}>
									<Grid item xs={12}>
										<Field
											as={TextField}
											label="Name"
											name="title"
											error={errors.title}
											helperText={
												errors.title && touched.title
													? errors.title
													: null
											}
										/>
									</Grid>
									<Grid item xs={12}>
										<Field
											as={TextField}
											label="Length"
											name="length"
											error={errors.length}
											helperText={
												errors.length && touched.length
													? errors.length
													: null
											}
											type="number"
											InputProps={inputProps(values)}
										/>
									</Grid>
									<Grid item xs={12}>
										<Field
											as={TextField}
											label="Width"
											name="width"
											error={errors.width}
											helperText={
												errors.width && touched.width
													? errors.width
													: null
											}
											type="number"
											InputProps={inputProps(values)}
										/>
									</Grid>
									<Grid item xs={12}>
										<Field
											as={TextField}
											label="Height"
											name="height"
											error={errors.height}
											helperText={
												errors.height && touched.height
													? errors.height
													: null
											}
											type="number"
											InputProps={inputProps(values)}
										/>
									</Grid>
									<Grid item xs={12}>
										<Field
											as={RadioGroup}
											fullWidth
											name="distance_unit"
											required
											label="Distance Unit"
										>
											<FormLabel id="distance_unit">
												Distance unit
											</FormLabel>
											{radioOptions.map((option) => (
												<FormControlLabel
													value={option.value}
													key={option.value}
													control={<Radio />}
													label={option.label}
												/>
											))}
										</Field>
									</Grid>

									<Grid item xs={12}>
										<LoadingButton
											variant="contained"
											type="submit"
											loading={isSubmitting}
										>
											{id ? 'Update' : 'Save'}
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
