import {
	Box,
	Button,
	FormControlLabel,
	FormLabel,
	Grid,
	IconButton,
	InputAdornment,
	Paper,
	Radio,
	RadioGroup,
	Stack,
	Tab,
	TextField,
} from '@mui/material';
import { useState } from '@wordpress/element';
import { Layout } from '../../../components/ui/layout/layout';
import { SupplierService } from '../../../features/punchout/suppliers/supplier-service';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Spinner } from '../../../components/spinner/Spinner';
import { Field, FieldArray, Form, Formik } from 'formik';
import { Supplier } from '../../../features/punchout/suppliers/supplier';
import { LoadingButton, TabContext, TabList, TabPanel } from '@mui/lab';
import * as Yup from 'yup';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import DeleteIcon from '@mui/icons-material/Delete';
import Switch from '@mui/material/Switch/Switch';

export const SupplierEdit = () => {
	const [showSecret, setShowSecret] = useState(false);
	const [isRefreshing, setRefreshing] = useState(false);
	const [tab, setTab] = useState('1');
	const handleClickShowSecret = () => setShowSecret((show: boolean) => !show);
	const handleRefresh = () => {
		setRefreshing(true);
		SupplierService.refresh(id).then((response) => {
			setRefreshing(false);
		});
	};

	const navigate = useNavigate();
	const parent = { label: 'Suppliers', to: '..' };
	const radioOptions = [
		{ label: 'DUNS', value: 'DUNS' },
		{ label: 'Network ID', value: 'NetworkID' },
	];
	const validationSchema = Yup.object().shape({
		name: Yup.string().required(),
		logo: Yup.string().url(),
		endpoint_base: Yup.string().url().required(),
		domain_type: Yup.string().required(),
		domain_identity: Yup.string().required(),
		domain_secret: Yup.string().required(),
		prefix: Yup.string(),
		punchout_identity: Yup.string().required(),
		punchout_secret: Yup.string().required(),
	});

	const { id } = useParams();
	const { data, isFetching } = useQuery({
		queryKey: [`supplier-${id}`],
		queryFn: () => SupplierService.show(id),
		enabled: !!id,
	});

	return (
		<Layout heading={`${id ? 'Edit' : 'Add'} supplier`} parent={parent}>
			{!data && id && isFetching && <Spinner />}
			{(data || !id) && (
				<Formik
					initialValues={id ? data : new Supplier()}
					onSubmit={(values, { setSubmitting }) => {
						if (id) {
							SupplierService.update(id, { ...values }).then(
								() => {
									setSubmitting(false);
								}
							);
						} else {
							SupplierService.store({ ...values }).then(
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
								<Grid container spacing={3}>
									<Grid item md={4} xs={12}>
										<Stack spacing={2}>
											<Field
												as={TextField}
												label="Name"
												name="name"
												error={errors.name}
												helperText={
													errors.name && touched.name
														? errors.name
														: null
												}
												required
												fullWidth
											/>
											<Field
												as={RadioGroup}
												fullWidth
												name="domain_type"
												required
												label="Domain Type"
											>
												<FormLabel id="domain_type">
													Domain type
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
											<Field
												as={TextField}
												label="Domain Identity"
												name="domain_identity"
												error={errors.domain_identity}
												helperText={
													errors.domain_identity &&
													touched.domain_identity
														? errors.domain_identity
														: null
												}
												required
												fullWidth
											/>
											<Field
												as={TextField}
												label="Domain Shared Secret"
												name="domain_secret"
												error={errors.domain_secret}
												helperText={
													errors.domain_secret &&
													touched.domain_secret
														? errors.domain_secret
														: null
												}
												type={
													showSecret
														? 'text'
														: 'password'
												}
												InputProps={{
													endAdornment: (
														<InputAdornment position="end">
															<IconButton
																onClick={
																	handleClickShowSecret
																}
																edge="end"
															>
																{showSecret ? (
																	<VisibilityOffIcon />
																) : (
																	<VisibilityIcon />
																)}
															</IconButton>
														</InputAdornment>
													),
												}}
												required
												fullWidth
											/>
											<Field
												as={TextField}
												label="Punchout Identity"
												name="punchout_identity"
												error={errors.punchout_identity}
												helperText={
													errors.punchout_identity &&
													touched.punchout_identity
														? errors.punchout_identity
														: null
												}
												required
												fullWidth
											/>
											<Field
												as={TextField}
												label="Punchout Shared Secret"
												name="punchout_secret"
												error={errors.punchout_secret}
												helperText={
													errors.punchout_secret &&
													touched.punchout_secret
														? errors.punchout_secret
														: null
												}
												type={
													showSecret
														? 'text'
														: 'password'
												}
												InputProps={{
													endAdornment: (
														<InputAdornment position="end">
															<IconButton
																onClick={
																	handleClickShowSecret
																}
																edge="end"
															>
																{showSecret ? (
																	<VisibilityOffIcon />
																) : (
																	<VisibilityIcon />
																)}
															</IconButton>
														</InputAdornment>
													),
												}}
												required
												fullWidth
											/>
											<Field
												as={TextField}
												label="SKU Prefix"
												name="prefix"
												error={errors.prefix}
												helperText={
													errors.prefix &&
													touched.prefix
														? errors.prefix
														: null
												}
												fullWidth
											/>
										</Stack>
									</Grid>
									<Grid item md={8} xs={12}>
										<TabContext value={tab}>
											<TabList
												onChange={(
													event: React.SyntheticEvent,
													newTab: string
												) => {
													setTab(newTab);
												}}
											>
												<Tab
													label="Endpoints"
													value="1"
												/>
												<Tab label="Logo" value="2" />
											</TabList>
											<Paper>
												<TabPanel value="1">
													<Stack spacing={2}>
														<Field name="update_endpoints_daily">
															{({ field }) => (
																<FormControlLabel
																	control={
																		<Switch
																			checked={
																				field.value
																			}
																			{...field}
																		/>
																	}
																	label="Update Endpoints Daily"
																/>
															)}
														</Field>

														<Field
															as={TextField}
															label="Endpoint Base URL"
															name="endpoint_base"
															error={
																errors.endpoint_base
															}
															helperText={
																errors.endpoint_base &&
																touched.endpoint_base
																	? errors.endpoint_base
																	: null
															}
															type="url"
															fullWidth
														/>
														{id && (
															<Box>
																<h3>
																	Endpoints
																</h3>
																<FieldArray
																	name="endpoints"
																	render={(
																		arrayHelpers
																	) => (
																		<Stack
																			spacing={
																				3
																			}
																		>
																			{values.endpoints.map(
																				(
																					endpoint,
																					index: number
																				) => (
																					<Stack
																						direction="row"
																						spacing={
																							1
																						}
																						key={
																							index
																						}
																						alignItems="flex-end"
																					>
																						<Grid
																							container
																							spacing={
																								1
																							}
																						>
																							<Grid
																								item
																								xs={
																									12
																								}
																							>
																								<Field
																									as={
																										TextField
																									}
																									label="Transaction"
																									name={`endpoints[${index}].transaction`}
																									size="small"
																								/>
																							</Grid>
																							<Grid
																								item
																								xs={
																									12
																								}
																							>
																								<Field
																									as={
																										TextField
																									}
																									name={`endpoints.${index}.url`}
																									label="URL"
																									type="url"
																									size="small"
																									fullWidth
																								/>
																							</Grid>
																						</Grid>
																						<IconButton aria-label="delete">
																							<DeleteIcon
																								onClick={() =>
																									arrayHelpers.remove(
																										index
																									)
																								}
																							/>
																						</IconButton>
																					</Stack>
																				)
																			)}
																			<Grid
																				item
																				xs={
																					12
																				}
																			>
																				<Button
																					variant="outlined"
																					type="button"
																					onClick={() =>
																						arrayHelpers.push(
																							{
																								transaction:
																									'',
																								url: '',
																							}
																						)
																					}
																				>
																					Add
																					Endpoint
																				</Button>
																			</Grid>
																		</Stack>
																	)}
																/>
															</Box>
														)}
													</Stack>
												</TabPanel>
												<TabPanel value="2">
													<Field
														as={TextField}
														label="Logo URL"
														name="logo"
														error={errors.logo}
														helperText={
															errors.logo &&
															touched.logo
																? errors.logo
																: null
														}
														type="url"
														fullWidth
													/>
												</TabPanel>
											</Paper>
										</TabContext>
									</Grid>
									<Grid item xs={12}>
										<Stack spacing={1} direction="row">
											<LoadingButton
												variant="contained"
												type="submit"
												loading={isSubmitting}
											>
												{id ? 'Update' : 'Save'}
											</LoadingButton>
											{id && (
												<LoadingButton
													variant="outlined"
													type="button"
													loading={isRefreshing}
													onClick={handleRefresh}
												>
													Refresh endpoints
												</LoadingButton>
											)}
										</Stack>
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
