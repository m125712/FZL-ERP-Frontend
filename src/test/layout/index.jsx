import { Outlet } from 'react-router-dom';
import Sidebar from './sidebar';
import Navbar from './navbar';

const Layout = () => {
	return (
		<div className='h-screen w-screen overflow-hidden'>
			<div className='flex h-full w-full'>
				<Sidebar />
				<main className='flex flex-1 flex-col'>
					<Navbar />
					<div className='h-full w-full flex-1 overflow-auto px-4 py-4 lg:px-8'>
						<Outlet />
					</div>
				</main>
			</div>
		</div>
	);
};

export default Layout;
