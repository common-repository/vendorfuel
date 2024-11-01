import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import * as Yup from 'yup';
import {
	Grid,
	FormLabel,
	Radio,
	RadioGroup,
	FormControlLabel,
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import LoadingButton from '@mui/lab/LoadingButton';

import { Spinner } from '../../../components/spinner/Spinner';
import { ReportService } from '../../../features/reports/report-service';
import { Layout } from '../../../components/ui/layout/layout';

export const ReportEdit = () => {
	const { id } = useParams();

	const breadcrumbs = [
		{
			label: 'Reports',
			href: `?page=vendorfuel#!/reports`,
		},
		{
			label: 'Schedule reports',
			href: `?page=vf-admin#/reports/schedule`,
		},
		{
			label: `ID: ${id.toString()}`,
			href: `?page=vf-admin#/reports/schedule/${id}`,
		},
	];

	const nav = [
		{
			label: 'Edit reports',
			href: `?page=vendorfuel#!/reports`,
		},
		{
			label: 'Downloadable reports',
			href: `?page=vf-admin#/reports/downloads`,
		},
	];

	const radioOptions = [
		{ label: 'Daily', value: 'daily' },
		{ label: 'Weekly', value: 'weekly' },
		{ label: 'Monthly', value: 'monthly' },
		{ label: 'Quarterly', value: 'quarterly' },
		{ label: 'None', value: 'none' },
	];

	const validationSchema = Yup.object().shape({
		frequency: Yup.string().required(
			'The report schedule frequency is required.'
		),
	});

	const { data, isFetching } = useQuery({
		queryKey: [`report-${id}`],
		queryFn: () => ReportService.show(id),
	});

	return (
		<Layout heading="Schedule report" nav={nav} breadcrumbs={breadcrumbs}>
			{!data && <Spinner />}
			{data && (
				<Formik
					initialValues={{
						frequency: data.frequency,
					}}
					validationSchema={validationSchema}
					onSubmit={(values, { setSubmitting }) => {
						ReportService.schedule({ id, ...values }).then(() => {
							setSubmitting(false);
						});
					}}
				>
					{({ isSubmitting }) => (
						<Form>
							<fieldset disabled={isFetching || isSubmitting}>
								<legend>{data.name}</legend>
								<Grid container spacing={2}>
									<Grid item xs={12}>
										<Field
											as={RadioGroup}
											name="frequency"
											required
											label="Frequency"
										>
											<FormLabel id="frequency">
												Frequency
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
