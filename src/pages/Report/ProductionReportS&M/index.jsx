import { useEffect } from 'react';

import Thread from './thread';
import Zipper from './zipper';

export default function Index() {
	useEffect(() => {
		document.title = 'Production Report S&M';
	}, []);

	return (
		<div className='space-y-6'>
			<Zipper />
			<Thread />
		</div>
	);
}
