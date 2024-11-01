import React from '@wordpress/element';
import { Header } from '../components/header/Header';
import { DashboardOrders } from '../features/dashboard/DashboardOrders';
import sections from '../data/dashboardSections.json';
import { SectionCards } from '../components/ui/SectionCards';
import { withAuth } from '../components/withAuth';

const Page = () => {
	return (
		<>
			<Header />
			<h2>Dashboard</h2>
			<DashboardOrders />
			<h3>Sections</h3>
			<SectionCards sections={sections} />
		</>
	);
};

export const DashboardPage = withAuth(Page);
