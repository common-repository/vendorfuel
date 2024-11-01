import { Layout } from '../../components/ui/layout/layout';
import { SectionGridCards } from '../../components/ui/section-grid-cards';
import sections from '../../features/punchout/sections.json';

export const PunchoutPage = () => {
	return (
		<Layout heading="Punchout">
			<SectionGridCards sections={sections} />
		</Layout>
	);
};
