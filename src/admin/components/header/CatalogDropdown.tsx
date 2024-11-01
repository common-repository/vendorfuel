import { Button, Dropdown, MenuGroup, MenuItem } from '@wordpress/components';
import React, { useEffect, useState } from '@wordpress/element';

export const CatalogDropdown = () => {
	const rootURL = `${location.origin}${location.pathname}`;
	const [href, setHref] = useState<string>(location.href);

	const handleSelect = (route: string, onClose: { (): void }) => {
		const url = `${rootURL}?page=vendorfuel#!/catalog/${route}`;
		setHref(url);
		onClose();
	};

	useEffect(() => {
		if (href && href !== location.href) {
			location.assign(href);
		}
	}, [href]);

	return (
		<Dropdown
			renderToggle={({ isOpen, onToggle }) => (
				<Button
					variant="tertiary"
					onClick={onToggle}
					aria-expanded={isOpen}
				>
					Catalog
				</Button>
			)}
			renderContent={({ onClose }) => (
				<MenuGroup label="Catalog">
					<MenuItem onClick={() => handleSelect('products', onClose)}>
						Products
					</MenuItem>
					<MenuItem
						onClick={() => handleSelect('categories', onClose)}
					>
						Categories
					</MenuItem>
					<MenuItem
						onClick={() => handleSelect('collections', onClose)}
					>
						Collections
					</MenuItem>
					<MenuItem
						onClick={() => handleSelect('manufacturers', onClose)}
					>
						Manufacturers
					</MenuItem>
					<MenuItem
						onClick={() => handleSelect('pricesheets', onClose)}
					>
						Price sheets
					</MenuItem>
					<MenuItem
						onClick={() => handleSelect('promo-codes/0', onClose)}
					>
						Promo codes
					</MenuItem>
					<MenuItem
						onClick={() => handleSelect('banners/0', onClose)}
					>
						Banner areas
					</MenuItem>
				</MenuGroup>
			)}
		/>
	);
};
