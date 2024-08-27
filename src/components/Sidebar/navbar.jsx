import Breadcrumbs from '@/ui/Others/Breadcrumbs';

const Navbar = () => {
	const items = [
		{
			label: 'Orders',
			path: '/orders',
		},
	];
	return (
		<nav className='h-16 w-full border-b bg-background px-8 py-4'>
			<div className='flex h-full items-center'>
				<Breadcrumbs items={items} />
			</div>
		</nav>
	);
};

export default Navbar;
