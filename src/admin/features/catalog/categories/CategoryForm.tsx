import { useEffect, useState } from '@wordpress/element';
import { Button, Flex, TextControl } from '@wordpress/components';
import PropTypes from 'prop-types';
import { Category } from '../../../catalog/categories/Category';
import { apiURL } from '../../../data/apiURL';
import { vfAPI } from '../../../shared/vfAPI';
import breadcrumbBase from './breadcrumbs.json';

export const CategoryForm = (props) => {
	const { id, isNew, setBreadcrumbs } = props;
	const [isBusy, setBusy] = useState<boolean>();
	const [category, setCategory] = useState<Category>(new Category());

	const deleteCategory = () => {
		setBusy(true);
		const url = `${apiURL.CATEGORIES}/${id}`;
		vfAPI.delete(url).then(() => {
			location.assign(location.href.replace(`/${id}`, ''));
			setBusy(false);
		});
	};

	const getCategory = (id: number) => {
		setBusy(true);
		const url = `${apiURL.CATEGORIES}/${id}`;
		vfAPI.get(url).then((response) => {
			if (response.data.category) {
				setCategory(response.data.category);
				setBreadcrumbs([
					...breadcrumbBase,
					{
						name: response.data.category.title,
						href: `?page=vendorfuel#!/catalog/categories/${id}`,
					},
				]);
				setBusy(false);
			}
		});
	};

	const saveCategory = () => {
		setBusy(true);
		const url = apiURL.CATEGORIES;
		const data = category;
		vfAPI.post(url, data).then((response) => {
			if (response.data.category?.cat_id) {
				const newId = response.data.category.cat_id;
				location.assign(
					location.href.replace('create', newId.toString())
				);
			}
			setBusy(false);
		});
	};

	const updateCategory = (id: number) => {
		setBusy(true);
		const url = `${apiURL.CATEGORIES}/${id}`;
		const data = category;
		vfAPI.put(url, data).then((response) => {
			setBusy(false);
		});
	};

	const handleChange = (change) => {
		const key = Object.keys(change)[0];
		const value = Object.values(change)[0];
		setCategory({ ...category, [key]: value });
	};

	const handleSubmit = (e: React.WPSyntheticEvent) => {
		e.preventDefault();
		if (id) {
			updateCategory(id);
		} else {
			saveCategory();
		}
	};

	useEffect(() => {
		if (id) {
			getCategory(id);
		}
	}, [id]);

	return (
		<form onSubmit={handleSubmit}>
			<fieldset disabled={isBusy}>
				<div className="row">
					<div className="col-lg-4">
						<TextControl
							label="Name"
							value={category.title}
							onChange={(title) => {
								handleChange({ title });
							}}
							required
						/>
					</div>
					<div className="col-lg-8"></div>
				</div>
			</fieldset>
			<Flex justify={'start'}>
				<Button variant="primary" isBusy={isBusy} type="submit">
					{isNew ? 'Save' : 'Update'}
				</Button>
				{id && (
					<Button
						variant="secondary"
						isDestructive
						isBusy={isBusy}
						onClick={deleteCategory}
					>
						Delete
					</Button>
				)}
			</Flex>
		</form>
	);
};

CategoryForm.propTypes = {
	isNew: PropTypes.bool,
	id: PropTypes.number,
	setBreadcrumbs: PropTypes.object,
};
