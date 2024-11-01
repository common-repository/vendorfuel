import { Layout } from '../../components/ui/layout/layout';
import { SectionGridCards } from '../../components/ui/section-grid-cards';
import sections from '../../features/purchasing/sections.json';

export const PurchasingPage = () => {
	return (
		<Layout heading="Purchasing">
			<SectionGridCards sections={sections} />
		</Layout>
	);
};
