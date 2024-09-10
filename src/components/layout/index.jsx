import { Outlet, useResolvedPath } from 'react-router-dom';
import Navbar from './navbar';
import LayoutProvider from './layout-provider';
import GlobalBreadcrumbs from '@/ui/Others/GlobalBreadcrumbs';
import Sidebar from './sidebar';

const Layout = () => {
	const { pathname } = useResolvedPath();
	return (
		<LayoutProvider>
			<div className='relative flex h-screen w-screen overflow-hidden'>
				<Sidebar />
				<main className='flex size-full flex-1 flex-col overflow-hidden'>
					<Navbar />
					<div className='flex size-full flex-1 flex-col overflow-hidden'>
						{pathname !== '/' && (
							<div className='bg-base-200 px-4 py-2 lg:px-8'>
								<GlobalBreadcrumbs />
							</div>
						)}
						<div className='size-full flex-1 overflow-auto px-4 py-6 lg:px-8'>
							<Outlet />
						</div>
					</div>
				</main>
			</div>
		</LayoutProvider>
	);
};

export default Layout;
