import { sidebarRoutes } from '@/routes';

import SidebarItem from './sidebar-item';

const SidebarMenu = () => {
	return (
		<ul className='h-full flex-1 space-y-1 overflow-auto px-4'>
			{sidebarRoutes.map((item, index) => {
				return <SidebarItem key={index} {...item} />;
			})}
		</ul>
	);
};

export default SidebarMenu;
