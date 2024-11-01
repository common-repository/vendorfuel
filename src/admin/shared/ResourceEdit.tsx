import {
	Box,
	Button,
	Card,
	CardContent,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Grid,
	Stack,
	Tab,
	Tabs,
	TextField,
	Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Field, Form, Formik } from 'formik';
import { useEffect, useState } from '@wordpress/element';
import { useNavigate, useParams } from 'react-router-dom';
import { Spinner } from '../components/spinner/Spinner';

interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

function TabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Card>
					<CardContent>
						<Typography>{children}</Typography>
					</CardContent>
				</Card>
			)}
		</div>
	);
}

function a11yProps(index: number) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	};
}

export const ResourceEdit = (props) => {
	const { model, service } = props;
	const { id } = useParams();
	const navigate = useNavigate();

	const [open, setOpen] = useState(false);

	const [value, setValue] = useState(0);

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleDelete = async () => {
		const response = await service.destroy(id);
		if (!response.errors.length) {
			setOpen(false);
			navigate(`../`);
		}
	};

	const handleSubmit = async (values: typeof model) => {
		if (id) {
			await service.update(id, values);
		} else {
			const response = await service.store(values);
			if (response.id) {
				navigate(`../${response.id}`);
			}
		}
	};

	const {
		isInitialLoading,
		isError,
		data,
		error,
		refetch,
		isFetching,
		isFetched,
	} = useQuery({
		queryKey: [`${model.id}-${id}`],
		queryFn: () => service.show(id),
		enabled: false,
		placeholderData: new model(),
	});

	const renderField = (field, touched, errors) => {
		return (
			<Grid item xs={12} key={field.name}>
				<Field
					type={field.type}
					name={field.name}
					as={field.as}
					label={field.label}
					error={touched[field.name] && errors[field.name]}
					helperText={`${
						touched[field.name] && errors[field.name]
							? errors[field.name]
							: ''
					}`}
					fullWidth
					multiline={field.multiline}
					rows={field.multiline ? 4 : 1}
				/>
			</Grid>
		);
	};

	useEffect(() => {
		if (id) {
			refetch();
		}
	}, [id]);

	return (
		<>
			{id && !data.id ? (
				<Spinner />
			) : (
				<Formik
					initialValues={data}
					onSubmit={handleSubmit}
					enableReinitialize
					validationSchema={model.validationSchema}
				>
					{({ errors, isSubmitting, touched }) => (
						<Form>
							<fieldset disabled={isSubmitting}>
								<Grid container spacing={3}>
									<Grid item xs={4}>
										<Grid container spacing={2}>
											{model.fields.map((field) =>
												renderField(
													field,
													touched,
													errors
												)
											)}
											<Grid item xs={12}>
												<Stack
													direction="row"
													spacing={2}
												>
													<Button
														type="submit"
														variant="contained"
														disabled={isSubmitting}
													>
														{id ? 'Update' : 'Save'}
													</Button>
													{id ? (
														<>
															<Button
																color="warning"
																disabled={
																	isSubmitting
																}
																onClick={
																	handleClickOpen
																}
															>
																Delete
															</Button>
															<Dialog
																open={open}
																onClose={
																	handleClose
																}
																aria-labelledby="alert-dialog-title"
																aria-describedby="alert-dialog-description"
															>
																<DialogTitle id="alert-dialog-title">
																	Delete this
																	vendor?
																</DialogTitle>
																<DialogContent>
																	<DialogContentText id="alert-dialog-description">
																		This
																		will
																		delete
																		this
																		vendor.
																	</DialogContentText>
																</DialogContent>
																<DialogActions>
																	<Button
																		onClick={
																			handleClose
																		}
																	>
																		Cancel
																	</Button>
																	<Button
																		variant="contained"
																		color="warning"
																		onClick={
																			handleDelete
																		}
																	>
																		Delete
																	</Button>
																</DialogActions>
															</Dialog>
														</>
													) : null}
												</Stack>
											</Grid>
										</Grid>
									</Grid>
									<Grid item xs={8}>
										{model.panels?.length ? (
											<Box sx={{ width: '100%' }}>
												<Tabs
													value={value}
													onChange={handleChange}
													aria-label="basic tabs example"
												>
													{model.panels.map(
														(panel, index) => (
															<Tab
																key={index}
																label={
																	panel.label
																}
																{...a11yProps(
																	index
																)}
															/>
														)
													)}
												</Tabs>
												{model.panels.map(
													(panel, index) => (
														<TabPanel
															key={index}
															value={value}
															index={index}
														>
															<Grid
																container
																spacing={2}
															>
																{panel.fields.map(
																	(field) =>
																		renderField(
																			field,
																			touched,
																			errors
																		)
																)}
															</Grid>
														</TabPanel>
													)
												)}
											</Box>
										) : null}
									</Grid>
								</Grid>
							</fieldset>
						</Form>
					)}
				</Formik>
			)}
		</>
	);
};
