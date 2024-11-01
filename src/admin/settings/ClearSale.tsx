import { useState } from '@wordpress/element';
import { Layout } from '../layout/Layout';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FraudService } from './FraudService';
import { Field, Form, Formik } from 'formik';
import { Spinner } from '../components/spinner/Spinner';

export const ClearSale = () => {
	const [showSecret, setShowSecret] = useState<boolean>(false);

	const breadcrumbs = [
		{
			label: 'Settings',
			href: '?page=vendorfuel#!/settings',
		},
		{
			label: 'ClearSale',
			to: '.',
		},
	];

	const handleReset = () => {
		FraudService.destroy();
	};

	const queryClient = useQueryClient();

	const resetValues = {
		enabled: false,
		sandbox: false,
		apiKey: '',
		clientID: '',
		clientSecret: '',
	};

	const { data, isFetching } = useQuery({
		queryKey: ['clearsale'],
		queryFn: FraudService.show,
	});

	return (
		<>
			<Layout heading="ClearSale" breadcrumbs={breadcrumbs}>
				{data ? (
					<div className="row">
						<div className="col col-md-8 col-lg-5">
							<Formik
								enableReinitialize
								initialValues={{
									enabled: data.enabled,
									sandbox: data.sandbox,
									apiKey: data.apiKey,
									clientID: data.clientID,
									clientSecret: data.clientSecret,
								}}
								onSubmit={(values, { setSubmitting }) => {
									FraudService.store(values).then(() =>
										setSubmitting(false)
									);
								}}
							>
								{({ isSubmitting, resetForm }) => (
									<>
										<Form>
											<fieldset disabled={isSubmitting}>
												<div className="form-check mb-3">
													<Field
														id="enabled"
														type="checkbox"
														name="enabled"
														className="form-check-input"
													/>
													<label
														className="form-check-label"
														htmlFor="enabled"
													>
														Export order to
														ClearSale for credit
														card orders
													</label>
												</div>
												<div className="form-check mb-3">
													<Field
														id="sandbox"
														type="checkbox"
														name="sandbox"
														className="form-check-input"
													/>
													<label
														className="form-check-label"
														htmlFor="sandbox"
													>
														Use Sandbox URL for
														ClearSale exports
													</label>
												</div>
												<div className="mb-3">
													<label
														className="form-label"
														htmlFor="apiKey"
													>
														ClearSale API key
													</label>
													<Field
														id="apiKey"
														type="text"
														name="apiKey"
														className="form-control"
													/>
												</div>
												<div className="mb-3">
													<label
														className="form-label"
														htmlFor="clientID"
													>
														ClearSale Client ID
													</label>
													<Field
														id="clientID"
														type="text"
														name="clientID"
														className="form-control"
													/>
												</div>
												<div className="mb-3">
													<label
														className="form-label"
														htmlFor="clientSecret"
													>
														ClearSale Client Secret
													</label>
													<div className="input-group">
														<Field
															id="clientSecret"
															type={
																showSecret
																	? 'text'
																	: 'password'
															}
															name="clientSecret"
															className="form-control"
															spellCheck={false}
														/>
														<button
															type="button"
															className="btn btn-outline-primary"
															onClick={() => {
																setShowSecret(
																	(prev) =>
																		!prev
																);
															}}
															aria-label={`${
																showSecret
																	? 'Hide'
																	: 'Show'
															} client secret`}
															title={`${
																showSecret
																	? 'Hide'
																	: 'Show'
															} client secret`}
														>
															<i
																className={`bi bi-eye-${
																	showSecret
																		? ''
																		: 'slash-'
																}fill`}
															></i>
														</button>
													</div>
												</div>
											</fieldset>
											<div className="btn-toolbar gap-1">
												<button
													className="btn btn-primary"
													type="submit"
													disabled={isSubmitting}
												>
													Update
												</button>
												<button
													className="btn btn-outline-danger border-0"
													type="button"
													disabled={isSubmitting}
													data-bs-toggle="modal"
													data-bs-target="#confirmationModal"
												>
													Reset
												</button>
											</div>
										</Form>
										<div
											className="modal fade"
											id="confirmationModal"
											aria-labelledby="confirmationModalLabel"
											aria-hidden="true"
										>
											<div className="modal-dialog">
												<div className="modal-content">
													<div className="modal-header">
														<h1
															className="modal-title fs-5"
															id="confirmationModalLabel"
														>
															Reset ClearSale
															settings
														</h1>
														<button
															type="button"
															className="btn-close"
															data-bs-dismiss="modal"
															aria-label="Close"
														></button>
													</div>
													<div className="modal-body">
														This will reset your
														ClearSale settings.
													</div>
													<div className="modal-footer">
														<button
															type="button"
															className="btn btn-link text-decoration-none"
															data-bs-dismiss="modal"
														>
															Cancel
														</button>
														<button
															type="button"
															className="btn btn-danger"
															data-bs-dismiss="modal"
															onClick={() => {
																resetForm({
																	values: resetValues,
																});
																handleReset();
															}}
														>
															Reset
														</button>
													</div>
												</div>
											</div>
										</div>
									</>
								)}
							</Formik>
						</div>
					</div>
				) : (
					<Spinner />
				)}
			</Layout>
		</>
	);
};
