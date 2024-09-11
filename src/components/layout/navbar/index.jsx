import BrandLogo from '../brand-logo';
import SidebarCollapse from '../sidebar/sidebar-collapse';
import SidebarMobileToggle from '../sidebar/sidebar-mobile-toggle';

const Navbar = () => {
	return (
		<div className='bg-background w-full border-b px-4 py-4 lg:px-8'>
			<div className='flex items-center justify-between'>
				<BrandLogo className={'w-fit text-primary md:hidden'} />
				<SidebarCollapse />
				<SidebarMobileToggle />
			</div>
		</div>
	);
};

export default Navbar;
