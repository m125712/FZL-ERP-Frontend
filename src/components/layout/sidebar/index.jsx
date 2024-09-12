import { useMediaQuery } from '@uidotdev/usehooks';

import SidebarDesktop from './sidebar-desktop';
import SidebarMobile from './sidebar-mobile';
import SidebarProvider from './sidebar-provider';

const Sidebar = () => {
	const isSmallDevice = useMediaQuery('only screen and (max-width : 768px)');
	return (
		<SidebarProvider>
			{!isSmallDevice && <SidebarDesktop />}
			{isSmallDevice && <SidebarMobile />}
		</SidebarProvider>
	);
};

export default Sidebar;
