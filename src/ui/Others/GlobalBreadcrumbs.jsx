import { RightArrow } from '@/assets/icons';
import cn from '@/lib/cn';
import { NavLink } from 'react-router-dom';
import useBreadcrumbs from 'use-react-router-breadcrumbs';

const GlobalBreadcrumbs = () => {
	const breadcrumbs = useBreadcrumbs();

	return (
		<div className='flex items-center gap-1'>
			{breadcrumbs.map(({ match, breadcrumb }, index) => (
				<>
					<NavLink
						className={cn(
							'text-md text-secondary',
							breadcrumbs.length - 1 === index &&
								'font-medium text-primary'
						)}
						key={match.pathname}
						to={match.pathname}>
						{breadcrumb}
					</NavLink>
					{index !== breadcrumbs.length - 1 && <RightArrow />}
				</>
			))}
		</div>
	);
};

export default GlobalBreadcrumbs;
