import { Outlet, useResolvedPath } from 'react-router-dom';
import Sidebar from './sidebar';
import Navbar from './navbar';
import LayoutProvider from './layout-provider';
import GlobalBreadcrumbs from '@/ui/Others/GlobalBreadcrumbs';

const Layout = () => {
	const { pathname } = useResolvedPath();
	return (
		<LayoutProvider>
			<div className='flex h-screen w-screen overflow-hidden'>
				<Sidebar />
				<main className='flex size-full flex-1 flex-col overflow-auto'>
					<Navbar />
					<div className='flex-1'>
						{pathname !== '/' && (
							<div className='mb-2 bg-base-200 px-4 py-2 lg:px-8'>
								<GlobalBreadcrumbs />
							</div>
						)}
						<div className='px-4 py-4 lg:px-8'>
							<Outlet />
						</div>
					</div>
				</main>
			</div>
		</LayoutProvider>
	);
};

export default Layout;
