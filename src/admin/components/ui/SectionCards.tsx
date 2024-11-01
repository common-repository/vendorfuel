import {
	Button,
	Card,
	CardBody,
	CardHeader,
	CardFooter,
	Icon,
	Flex,
} from '@wordpress/components';

interface Props {
	sections: {
		body?: string;
		header: string;
		href: string;
		icon?: any;
		links?: {
			href: string;
			text: string;
		}[];
	}[];
}

export const SectionCards = ({ sections }: Props) => {
	const sectionsStyle = {
		display: 'grid',
		gridTemplateColumns: 'repeat(auto-fill, minmax(min(40ch, 100%), 1fr))',
		gap: '8px',
	};

	const minHeightInitial = { minHeight: 'initial' };

	return (
		<section style={sectionsStyle}>
			{sections.map((section, index: number) => (
				<Card key={index}>
					<Flex direction="column" expanded={true}>
						<CardHeader style={minHeightInitial}>
							<a
								href={section.href}
								style={{ textDecoration: 'none' }}
							>
								<Flex align="center" justify={'start'} gap={1}>
									{section.icon && (
										<Icon icon={section.icon} />
									)}
									<span>{section.header}</span>
								</Flex>
							</a>
						</CardHeader>
						<CardBody style={{ height: '100%' }}>
							{section.body && <p>{section.body}</p>}
							{section.links && (
								<ul style={{ listStyle: 'none', padding: 0 }}>
									{section.links.map((link, i: number) => (
										<li key={i}>
											<Button
												variant="link"
												href={link.href}
											>
												{link.text}
											</Button>
										</li>
									))}
								</ul>
							)}
						</CardBody>
						<CardFooter style={minHeightInitial}>
							<Button href={section.href} variant="secondary">
								Manage {section.header.toLocaleLowerCase()}
							</Button>
						</CardFooter>
					</Flex>
				</Card>
			))}
		</section>
	);
};
