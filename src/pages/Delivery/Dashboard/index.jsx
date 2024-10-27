import { useEffect } from 'react';

import ThreadDashboard from './thread-dashboard';
import ZipperDashboard from './zipper-dashboard';

export default function Index() {
	useEffect(() => {
		document.title = 'DashBoard';
	}, []);
	return (
		<div>
			<ZipperDashboard />
			<hr className='my-6 border-2 border-dashed border-secondary-content' />
			<ThreadDashboard />
		</div>
	);
}
