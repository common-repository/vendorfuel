import { Layout } from '../../components/ui/layout/layout';
import { SectionGridCards } from '../../components/ui/section-grid-cards';
import sections from '../../features/customers/sections.json';

export const CustomersPage = () => {
	return (
		<Layout heading="Customers">
			<SectionGridCards sections={sections} />
		</Layout>
	);
};
