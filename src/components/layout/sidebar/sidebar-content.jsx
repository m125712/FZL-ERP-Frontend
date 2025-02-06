import SidebarHeader from './sidebar-header';
import SidebarLogout from './sidebar-logout';
import SidebarMenu from './sidebar-menu';

const SidebarContent = () => {
	return (
		<aside className='relative flex h-full w-full flex-col bg-primary'>
			<SidebarHeader />
			<SidebarMenu />
			<div className='px-4 py-2'>
				<SidebarLogout />
			</div>
		</aside>
	);
};

export default SidebarContent;
