import { sidebarRoutes } from '@/routes';
import { NavLink } from 'react-router-dom';

import cn from '@/lib/cn';

const BrandLogo = ({ className, ...props }) => {
	const route = sidebarRoutes[0];

	return (
		<NavLink
			className={cn(
				'flex items-center justify-center text-2xl font-bold text-primary-content md:text-4xl',
				className
			)}
			to={route?.path}
			{...props}>
			FZL
		</NavLink>
	);
};

export default BrandLogo;
