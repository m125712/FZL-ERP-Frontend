import cn from '@/lib/cn';

import SidebarHeader from './sidebar-header';
import SidebarLogout from './sidebar-logout';
import SidebarMenu from './sidebar-menu';

const SidebarContent = () => {
	return (
		<aside
			className={cn('relative flex h-full w-full flex-col bg-primary')}>
			<SidebarHeader />
			<SidebarMenu />
			<div className='p-4'>
				<SidebarLogout />
			</div>
		</aside>
	);
};

export default SidebarContent;
