import { SectionGridCards } from '../../components/ui/section-grid-cards';
import sections from '../../features/shipping/sections.json';
import { Layout } from '../../components/ui/layout/layout';

export const ShippingPage = () => {
	return (
		<Layout heading="Shipping">
			<SectionGridCards sections={sections} />
		</Layout>
	);
};
