import sections from '../data/catalogSections.json';
import { SectionCards } from '../components/ui/SectionCards';
import { withAuth } from '../components/withAuth';

const Page = () => {
	return (
		<>
			<h2>Catalog</h2>
			<SectionCards sections={ sections } />
		</>
	);
};

export const CatalogPage = withAuth( Page );
