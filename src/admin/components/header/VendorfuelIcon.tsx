import React from '@wordpress/element';
import { Icon } from '@wordpress/components';
import PropTypes from 'prop-types';

export const VendorfuelIcon = ({ size = 24 }) => {
	const icon = (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 68.92 112.65">
			<g>
				<linearGradient
					id="gradient"
					x1="16.89"
					y1="56.33"
					x2="84.25"
					y2="56.33"
					gradientUnits="userSpaceOnUse"
				>
					<stop offset="0" stopColor="#fbb034" />
					<stop offset="0.04" stopColor="#faa633" />
					<stop offset="0.25" stopColor="#f67e2d" />
					<stop offset="0.46" stopColor="#f25e29" />
					<stop offset="0.65" stopColor="#f04726" />
					<stop offset="0.84" stopColor="#ee3a25" />
					<stop offset="1" stopColor="#ee3524" />
				</linearGradient>
				<path
					className="vendorfuel-icon"
					style={{ fill: 'url(#gradient)' }}
					d="M60.34,51.11C58,58.32,68.8,69.52,66,81.54c-7.11,30.88-38.46,31.3-38.82,31.09L36,80.94H45.1l2.45-9.1h-9l1.22-4.73c.67-3.46,5-1.92,8.27-3,5.22-1.78,5.65-6,7.72-12.67.85-2.94,2.79-6.57,6-7.2a6.94,6.94,0,0,1,7.2,3.51C65.72,46,62.12,46.08,60.34,51.11ZM17.13,111.76l8.4-30.83H20.21l2.45-9.1H28l.88-3.24c2.58-9.38,6.5-12.17,16.73-12.4,8-.11,11-13.58,10.7-20.37C55.71,21.48,48.19,17.5,45.1,10.3c-2-4.76-.86-8.48,1.65-10.3C41.54,1.76,39,5.72,38.61,11.5S42.14,23.74,39.93,28c-3.88,6-14.74,7.93-23.43,12C5.41,45.22.21,53.18,0,65.75c-.15,20.08,15.55,18.08,15.45,46A15.08,15.08,0,0,0,17.13,111.76ZM59.44,41.31c2.86-2.1,5.72-4.1,7.37-8.44,1.75-4.56-.79-9-2.2-12.85-.89-2.46,1.3-6.71,1.3-6.71s-7.27,5.92-6.21,13.41C61.38,35.69,61.28,35.23,59.44,41.31Z"
				/>
			</g>
		</svg>
	);

	return <Icon icon={icon} size={size} />;
};

VendorfuelIcon.propTypes = {
	size: PropTypes.number,
};
