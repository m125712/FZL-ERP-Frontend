import SidebarProvider from './sidebar-provider';
import SidebarDesktop from './sidebar-desktop';
import SidebarMobile from './sidebar-mobile';
import { useMediaQuery } from '@uidotdev/usehooks';

const Sidebar = () => {
	const isSmallDevice = useMediaQuery('only screen and (max-width : 768px)');
	return (
		<SidebarProvider>
			<SidebarDesktop />
			{isSmallDevice && <SidebarMobile />}
		</SidebarProvider>
	);
};

export default Sidebar;
