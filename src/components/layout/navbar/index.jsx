import { useResolvedPath } from 'react-router-dom';

import GlobalBreadcrumbs from '@/ui/Others/GlobalBreadcrumbs';

import cn from '@/lib/cn';

import BrandLogo from '../brand-logo';
import { useLayout } from '../layout-provider';
import SidebarCollapse from '../sidebar/sidebar-collapse';
import SidebarMobileToggle from '../sidebar/sidebar-mobile-toggle';

const Navbar = () => {
	const { pathname } = useResolvedPath();
	const { setIsCollapsed } = useLayout();
	return (
		<div className='w-full border-b'>
			<div className='flex flex-col gap-2'>
				<div className='bg-background flex items-center justify-between gap-4 px-4 py-2 md:hidden'>
					<BrandLogo className={'w-fit text-primary'} />
					<SidebarMobileToggle />
				</div>

				<div
					className={cn(
						'flex items-center gap-6 bg-base-200 px-2 py-0.5 md:px-0 md:py-0',
						pathname === '/' && 'hidden md:block'
					)}>
					<div
						className='hidden h-full w-fit cursor-pointer items-center border-r border-secondary/10 hover:bg-primary/20 md:flex md:p-2'
						onClick={() => {
							setIsCollapsed((prev) => !prev);
						}}>
						<SidebarCollapse />
					</div>
					{pathname !== '/' && <GlobalBreadcrumbs />}
				</div>
			</div>
		</div>
	);
};

export default Navbar;
