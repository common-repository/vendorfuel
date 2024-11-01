import { Stats } from '../features/dashboard/stats';
import { SectionGridCards } from '../shared/SectionGridCards';
import sections from './sections.json';
import { Layout } from '../layout/Layout';
import { RecentOrders } from './RecentOrders';

export const DashboardPage = () => {
	return (
		<Layout heading="Dashboard">
			<Stats />
			<RecentOrders />
			<SectionGridCards sections={sections} />
		</Layout>
	);
};
