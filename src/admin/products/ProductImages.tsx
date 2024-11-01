import { useEffect, useState } from '@wordpress/element';
import PropTypes from 'prop-types';
import type { Product } from '../catalog/products/Product';
import type { Image } from '../shared/Image';
import { Modal } from 'bootstrap';

declare const wp: any;

export const ProductImages = (props) => {
	const [product, setProduct] = useState<Product>();

	const imageName = (image: { name?: string; orig_url: string }) => {
		if (image.name) {
			return image.name;
		}
		const url = new URL(image.orig_url);
		return url.pathname.split('/').pop();
	};

	const handleAdd = (image: Image) => {
		const updatedProduct = { ...product };
		if (updatedProduct.images) {
			updatedProduct.images.push({
				thumbnail: image.thumbnail.url,
				orig_url: image.full.url,
				orig_w: image.full.width,
				orig_h: image.full.height,
			});
		}
		setProduct(updatedProduct);
		props.handleChange('images', updatedProduct.images);
	};

	const handleConfirm = (index: number) => {
		const modalEl = document.getElementById(`confirmationModal-${index}`);
		const modal = Modal.getInstance(modalEl);
		modal.hide();

		modalEl.addEventListener('hidden.bs.modal', (e) => {
			handleRemove(index);
		});
	};

	const handleRemove = (index: number) => {
		const updatedProduct = { ...product };
		if (updatedProduct.images) {
			if (updatedProduct?.images[index].wpImg) {
				delete updatedProduct.images[index];
			} else {
				updatedProduct.images[index].deleted = true;
			}
		}
		setProduct(updatedProduct);
		props.handleChange('images', updatedProduct.images);
	};

	const handleUpload = () => {
		const fileFrame = wp.media({
			title: 'Select or upload image',
			library: {
				type: 'image',
			},
			button: {
				text: 'Select',
			},
			multiple: false,
		});

		fileFrame.on('select', () => {
			const image = fileFrame
				.state()
				.get('selection')
				.first()
				.toJSON().sizes;
			handleAdd(image);
		});
		fileFrame.open();

		// Hide edit and delete attachment links.
		fileFrame.on('selection:toggle', () => {
			const editLink =
				document.querySelector<HTMLElement>('.edit-attachment');
			const deleteLink =
				document.querySelector<HTMLElement>('.delete-attachment');

			if (editLink) {
				editLink.style.display = 'none';
			}
			if (deleteLink) {
				deleteLink.style.display = 'none';
			}
		});
	};

	useEffect(() => {
		setProduct(JSON.parse(props.product));
	}, [props]);

	return (
		<>
			<div className="row row-cols-2 row-cols-lg-3 g-3 mb-3">
				{product?.images?.map((image, index) => (
					<>
						{!image.deleted && (
							<div key={index} className="col">
								<div className="card shadow-sm">
									<img
										src={
											image.thumbnail ||
											image.small_url ||
											image.thumb_url
										}
										className="card-img-top"
										alt=""
									/>
									<div className="card-body">
										<h5 className="card-title">
											{imageName(image)}
										</h5>
										<h6 className="card-subtitle mb-2 text-muted">
											{`${image.orig_w.toLocaleString()} by ${image.orig_h.toLocaleString()} px`}
										</h6>
										<button
											type="button"
											className="btn btn-danger btn-sm"
											data-bs-toggle="modal"
											data-bs-target={`#confirmationModal-${index}`}
										>
											Delete
										</button>
									</div>
								</div>
								<div
									className="modal fade"
									id={`confirmationModal-${index}`}
									tabIndex={-1}
									aria-labelledby="exampleModalLabel"
									aria-hidden="true"
								>
									<div className="modal-dialog">
										<div className="modal-content">
											<div className="modal-header">
												<h1
													className="modal-title fs-5"
													id="exampleModalLabel"
												>
													Remove this image?
												</h1>
												<button
													type="button"
													className="btn-close"
													data-bs-dismiss="modal"
													aria-label="Close"
												></button>
											</div>
											<div className="modal-body">
												This will remove this image from
												this product. It will not delete
												the image from your files or
												WordPress media library.
											</div>
											<div className="modal-footer">
												<button
													type="button"
													className="btn btn-outline-primary"
													data-bs-dismiss="modal"
												>
													Cancel
												</button>
												<button
													type="button"
													className="btn btn-danger"
													onClick={() => {
														handleConfirm(index);
													}}
												>
													Remove
												</button>
											</div>
										</div>
									</div>
								</div>
							</div>
						)}
					</>
				))}
			</div>
			<button className="btn btn-outline-primary" onClick={handleUpload}>
				Select or Upload Image
			</button>
		</>
	);
};

ProductImages.propTypes = {
	product: PropTypes.string,
	images: PropTypes.string, // Stringified array
	handleChange: PropTypes.func,
};
