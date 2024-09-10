import SidebarProvider from './sidebar-provider';
import SidebarContent from './sidebar-content';

const Sidebar = () => {
	return (
		<SidebarProvider>
			<SidebarContent />
		</SidebarProvider>
	);
};

export default Sidebar;
