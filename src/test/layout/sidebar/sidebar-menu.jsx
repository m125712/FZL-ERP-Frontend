import { routes } from '@/test/routes/routes';

import SidebarItem from './sidebar-item';

const SidebarMenu = () => {
	return (
		<ul className='h-full flex-1 space-y-1 overflow-auto pl-4 pr-6'>
			{routes.map((item) => {
				return <SidebarItem key={item.path} {...item} />;
			})}
		</ul>
	);
};

export default SidebarMenu;
