import { Layout } from '../layout/Layout';
import { SectionGridCards } from '../shared/SectionGridCards';
import sections from './sections.json';

export const PunchoutPage = () => {
	return (
		<Layout heading="Punchout">
			<SectionGridCards sections={sections} />
		</Layout>
	);
};
