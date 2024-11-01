import { Stats } from '../../features/dashboard/stats';
import { SectionGridCards } from '../../components/ui/section-grid-cards';
import sections from '../../features/dashboard/sections.json';
import { Layout } from '../../components/ui/layout/layout';
import { RecentOrders } from '../../features/dashboard/recent-orders';

export const DashboardPage = () => {
	return (
		<Layout heading="Dashboard">
			<Stats />
			<RecentOrders />
			<SectionGridCards sections={sections} />
		</Layout>
	);
};
