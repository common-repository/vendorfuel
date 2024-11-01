import sections from '../data/purchasingSections.json';
import { SectionCards } from '../components/ui/SectionCards';
import { withAuth } from '../components/withAuth';

const Page = () => {
	return (
		<>
			<h2>Purchasing</h2>
			<SectionCards sections={ sections } />
		</>
	);
};

export const PurchasingPage = withAuth( Page );
