import { Layout } from '../layout/Layout';
import { SectionGridCards } from '../shared/SectionGridCards';
import sections from './sections.json';

export const CustomersPage = () => {
	return (
		<Layout heading="Customers">
			<SectionGridCards sections={sections} />
		</Layout>
	);
};
