import { Suspense } from '@/components/Feedback';
import { Outlet, useLocation } from 'react-router-dom';
import { Aside, MobileHeader } from './components';
import Navbar from './navbar';

const Drawer = () => {
	const location = useLocation();
	const isHidden = location?.pathname.includes('/login', '/') ? true : false;
	const id = 'navbar-drawer';

	return (
		<div className='drawer md:drawer-open'>
			<input id={id} type='checkbox' className='drawer-toggle' />
			<div className='drawer-content flex h-screen flex-col overflow-x-hidden'>
				<main className='h-screen overflow-y-auto overflow-x-hidden'>
					{!isHidden && <MobileHeader {...{ id }} />}
					<Suspense>
						<Navbar />
						<div className='px-4 py-4 lg:px-8'>
							<Outlet />
						</div>
					</Suspense>
				</main>
			</div>
			{!isHidden && <Aside {...{ id }} />}
		</div>
	);
};

export default Drawer;
