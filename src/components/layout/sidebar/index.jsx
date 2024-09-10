import SidebarProvider from './sidebar-provider';
import SidebarDesktop from './sidebar-desktop';
import SidebarMobile from './sidebar-mobile';

const Sidebar = () => {
	return (
		<SidebarProvider>
			<SidebarDesktop />
			<SidebarMobile />
		</SidebarProvider>
	);
};

export default Sidebar;
