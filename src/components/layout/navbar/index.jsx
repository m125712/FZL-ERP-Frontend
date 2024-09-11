import GlobalBreadcrumbs from '@/ui/Others/GlobalBreadcrumbs';
import BrandLogo from '../brand-logo';
import SidebarCollapse from '../sidebar/sidebar-collapse';
import SidebarMobileToggle from '../sidebar/sidebar-mobile-toggle';
import { useResolvedPath } from 'react-router-dom';
import cn from '@/lib/cn';

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
						'flex items-center gap-6 bg-base-200 px-4 py-2 md:px-0 md:py-0',
						pathname === '/' && 'hidden md:block'
					)}>
					<div className='hidden h-full w-fit items-center border-r border-secondary/10 p-4 md:flex'>
						<SidebarCollapse />
					</div>
					{pathname !== '/' && <GlobalBreadcrumbs />}
				</div>
			</div>
		</div>
	);
};

export default Navbar;
