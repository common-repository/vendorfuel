import { Layout } from '../layout/Layout';
import { SectionGridCards } from '../shared/SectionGridCards';
import sections from './sections.json';

export const PurchasingPage = () => {
	return (
		<Layout heading="Purchasing">
			<SectionGridCards sections={sections} />
		</Layout>
	);
};
