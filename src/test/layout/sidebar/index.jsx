import { routes } from '@/test/routes/routes';
import SidebarItem from './sidebar-item';
import SidebarProvider from './sidebar-provider';
import SidebarHeader from './sidebar-header';

const Sidebar = () => {
	return (
		<SidebarProvider>
			<aside className='min-w-[17rem] bg-primary'>
				<SidebarHeader />
				<ul>
					{routes.map((item) => {
						return <SidebarItem key={item.path} {...item} />;
					})}
				</ul>
			</aside>
		</SidebarProvider>
	);
};

export default Sidebar;
