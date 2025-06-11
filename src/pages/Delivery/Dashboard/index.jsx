import { useEffect } from 'react';

import Bar from './Bar';
import ThreadDashboard from './thread-dashboard';
import ZipperDashboard from './zipper-dashboard';

export default function Index() {
	useEffect(() => {
		document.title = 'Delivery: Dashboard';
	}, []);
	return (
		<div className='flex flex-col'>
			<Bar />
			{/* <hr className='my-6 border-2 border-dashed border-secondary-content' />
			<ZipperDashboard />
			<hr className='my-6 border-2 border-dashed border-secondary-content' />
			<ThreadDashboard /> */}
		</div>
	);
}
