import { Outlet, useResolvedPath } from 'react-router-dom';

import { cn } from '@/lib/utils';

import LayoutProvider from './layout-provider';
import Navbar from './navbar';
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
						<div
							className={cn(
								'size-full flex-1 overflow-auto',
								pathname !== '/' && 'px-4 py-6 lg:px-8'
							)}>
							<Outlet />
						</div>
					</div>
				</main>
			</div>
		</LayoutProvider>
	);
};

export default Layout;
