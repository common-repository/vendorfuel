import { SectionCards } from '../components/ui/SectionCards';
import { withAuth } from '../components/withAuth';
import sections from '../data/customersSections.json';

const Page = () => {
	return (
		<>
			<h2>Customers</h2>
			<SectionCards sections={ sections } />
		</>
	);
};

export const CustomersPage = withAuth( Page );
