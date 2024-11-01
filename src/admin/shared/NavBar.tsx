/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect, useState } from '@wordpress/element';
import Cookies from 'universal-cookie';
import * as bootstrap from 'bootstrap';
import {
	AppBar,
	Box,
	Button,
	Container,
	Divider,
	Drawer,
	IconButton,
	Link,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	ListSubheader,
	Stack,
	ThemeProvider,
	Toolbar,
	Tooltip,
	Typography,
} from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { theme } from './theme';

const mainNav = [
	{
		label: 'Catalog',
		href: '?page=vf-catalog',
		icon: <ImportContactsIcon />,
	},
	{
		label: 'Customers',
		href: '?page=vf-customers',
		icon: <AccountCircleIcon />,
	},
	{
		label: 'Orders',
		href: '?page=vendorfuel#!/orders',
		icon: <ReceiptIcon />,
	},
	{
		label: 'Reports',
		href: '?page=vendorfuel#!/reports',
		icon: <AssessmentIcon />,
	},
];

const secondaryNav = [
	{
		items: [
			{
				label: 'Purchasing',
				href: '?page=vf-purchasing',
			},
			{
				label: 'Punchout',
				href: '?page=vf-punchout#/suppliers',
			},
			{
				label: 'Shipping',
				href: '?page=vf-shipping',
			},
			{
				label: 'Email templates',
				href: '?page=vendorfuel#!/email',
			},
		],
	},
	{
		subheader: 'Finance',
		items: [
			{
				label: 'Accounting',
				href: '?page=vf-accounting',
			},
			{
				label: 'Payment gateways',
				href: '?page=vendorfuel#!/payments',
			},
			{
				label: 'Taxes',
				href: '?page=vendorfuel#!/taxes',
			},
		],
	},
	{
		subheader: 'Admin',
		items: [
			{
				label: 'Admin users',
				href: '?page=vf-users',
			},
			{
				label: 'Settings',
				href: '?page=vendorfuel#!/settings',
			},
		],
	},
	{
		items: [
			{
				label: 'Sign out',
				href: '?page=vf-signout',
			},
		],
	},
];

export const NavBar = () => {
	const cookies = new Cookies();
	const [authed, setAuthed] = useState<boolean>(false);
	const [open, setOpen] = useState<boolean>(false);

	useEffect(() => {
		const tokena = cookies.get('vendorfuel-admin-tokena');
		const tokenb = cookies.get('vendorfuel-admin-tokenb');
		setAuthed(tokena && tokenb);

		/**
		 * Init Bootstrap dropdown menus.
		 */
		const dropdownElementList =
			document.querySelectorAll('.dropdown-toggle');
		const dropdownList = [...dropdownElementList].map(
			(dropdownToggleEl) => new bootstrap.Dropdown(dropdownToggleEl)
		);
	}, []);

	return (
		<ThemeProvider theme={theme}>
			<Box
				sx={{
					flexGrow: 1,
					marginTop: '-10px',
					marginLeft: '-22px',
					marginRight: '-24px',
				}}
			>
				<AppBar
					position="static"
					color="transparent"
					sx={{ backgroundColor: '#fff', mb: 2 }}
				>
					<Container>
						<Toolbar disableGutters>
							<Stack direction="row" alignItems="center">
								<img
									src={`${localized.dir.url}/assets/img/vf-logo.svg`}
									alt=""
									width="30"
									height="24"
									className="d-inline-block align-text-top"
								/>
								<Typography
									variant="h6"
									noWrap
									component="a"
									href="?page=vf-admin"
									sx={{
										mr: 2,
										display: { xs: 'none', md: 'flex' },
										color: 'inherit',
										textDecoration: 'none',
									}}
								>
									VendorFuel
								</Typography>
							</Stack>
							{authed && (
								<>
									{/* Mobile menu */}
									<Stack
										direction="row"
										justifyContent="end"
										sx={{
											marginLeft: 'auto',
											display: { xs: 'flex', md: 'none' },
										}}
									>
										{mainNav.map((item, i) => (
											<IconButton
												key={i}
												aria-label={item.label}
												href={item.href}
												title={item.label}
											>
												{item.icon}
											</IconButton>
										))}
									</Stack>

									{/* Desktop menu */}
									<Stack
										spacing={1}
										direction="row"
										justifyContent="end"
										sx={{
											marginLeft: 'auto',
											display: { xs: 'none', md: 'flex' },
										}}
									>
										{mainNav.map((item, i) => (
											<Button
												color="inherit"
												startIcon={item.icon}
												key={i}
												href={item.href}
											>
												{item.label}
											</Button>
										))}
									</Stack>
									<IconButton
										aria-label="More"
										title="Reports"
										onClick={() => setOpen(!open)}
									>
										<MoreVertIcon />
									</IconButton>
								</>
							)}
						</Toolbar>
					</Container>
				</AppBar>
			</Box>
			<Drawer anchor="right" open={open} onClose={() => setOpen(!open)}>
				<List sx={{ marginTop: 'var(--wp-admin--admin-bar--height)' }}>
					{secondaryNav.map((group, i) => (
						<>
							{i > 0 ? <Divider /> : null}
							{group.subheader ? (
								<ListSubheader component="div">
									{group.subheader}
								</ListSubheader>
							) : null}
							{group.items.map((item, j) => (
								<ListItem key={j} disablePadding>
									<ListItemButton
										component="a"
										href={item.href}
										onClick={() => {
											setOpen(false);
										}}
									>
										<ListItemText primary={item.label} />
									</ListItemButton>
								</ListItem>
							))}
						</>
					))}
				</List>
			</Drawer>
		</ThemeProvider>
	);
};
