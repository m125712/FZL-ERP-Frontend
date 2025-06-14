import { Suspense } from 'react';
import Cookies from 'js-cookie';
import { Navigate, Outlet, useResolvedPath } from 'react-router';

import { cn } from '@/lib/utils';

import LayoutProvider from './layout-provider';
import Loader from './loader';
import Navbar from './navbar';
import Sidebar from './sidebar';

const Layout = () => {
	const { pathname } = useResolvedPath();
	const hasUserCookie = Cookies.get('user');
	const signed = !!hasUserCookie;

	if (!signed) return <Navigate to={`/login`} replace />;

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
								pathname !== '/' && 'px-1 py-2 lg:px-2'
							)}
						>
							<Suspense fallback={<Loader />}>
								<Outlet />
							</Suspense>
						</div>
					</div>
				</main>
			</div>
		</LayoutProvider>
	);
};

export default Layout;
