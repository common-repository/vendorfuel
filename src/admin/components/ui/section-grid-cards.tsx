import { Link as RouterLink } from 'react-router-dom';
import {
	Card,
	CardActionArea,
	CardContent,
	Grid,
	MenuItem,
	MenuList,
} from '@mui/material';

interface Section {
	title: string;
	body?: string;
	link?: string;
	to?: string;
	links?: {
		text: string;
		link?: string;
		to?: string;
	}[];
}

interface Props {
	sections: Section[];
}

export const SectionGridCards = (props: Props) => {
	const { sections } = props;

	return (
		<Grid container spacing={2}>
			{sections.map((section, index) => (
				<Grid item key={index} xs={6} sm={4} md={3}>
					<Card sx={{ height: '100%' }}>
						<CardActionArea
							component={section.link ? 'a' : RouterLink}
							href={section.link || null}
							to={section.to || null}
							sx={!section.links ? { height: '100%' } : {}}
						>
							<CardContent>
								<h2 style={{ margin: 0 }}>{section.title}</h2>
								{section.body ? (
									<p className="description">
										{section.body}
									</p>
								) : null}
							</CardContent>
						</CardActionArea>
						{section.links ? (
							<MenuList dense sx={{ paddingTop: 0 }}>
								{section.links.map((link, i) => (
									<MenuItem
										key={i}
										component={link.to ? RouterLink : 'a'}
										to={link.to}
										href={link.link}
									>
										{link.text}
									</MenuItem>
								))}
							</MenuList>
						) : null}
					</Card>
				</Grid>
			))}
		</Grid>
	);
};
