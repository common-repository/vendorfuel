import { SectionGridCards } from '../shared/SectionGridCards';
import sections from './sections.json';
import { Layout } from '../layout/Layout';

export const ShippingPage = () => {
	return (
		<Layout heading="Shipping">
			<SectionGridCards sections={sections} />
		</Layout>
	);
};
