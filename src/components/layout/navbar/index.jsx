import cn from '@/lib/cn';
import GlobalBreadcrumbs from '@/ui/Others/GlobalBreadcrumbs';
import { useResolvedPath } from 'react-router-dom';
import BrandLogo from '../brand-logo';
import SidebarCollapse from '../sidebar/sidebar-collapse';
import SidebarMobileToggle from '../sidebar/sidebar-mobile-toggle';

const Navbar = () => {
	const { pathname } = useResolvedPath();
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
					<div className='hidden h-full w-fit items-center border-r border-secondary/10 md:flex md:p-2'>
						<SidebarCollapse />
					</div>
					{pathname !== '/' && <GlobalBreadcrumbs />}
				</div>
			</div>
		</div>
	);
};

export default Navbar;
