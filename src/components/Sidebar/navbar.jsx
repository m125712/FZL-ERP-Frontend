import GlobalBreadcrumbs from '@/ui/Others/GlobalBreadcrumbs';

const Navbar = () => {
	return (
		<nav className='bg-background h-16 w-full border-b px-4 py-4 lg:px-8'>
			<div className='flex h-full items-center'>
				<GlobalBreadcrumbs />
			</div>
		</nav>
	);
};

export default Navbar;
