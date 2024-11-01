import sections from '../data/punchoutSections.json';
import { SectionCards } from '../components/ui/SectionCards';
import { withAuth } from '../components/withAuth';

const Page = () => {
	return (
		<>
			<h2>Punchout</h2>
			<SectionCards sections={ sections } />
		</>
	);
};

export const PunchoutPage = withAuth( Page );
