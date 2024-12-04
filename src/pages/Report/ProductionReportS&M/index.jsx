import { useEffect } from 'react';

import Thread from './thread';
import ThreadPartyWise from './thread-party-wise';
import Zipper from './zipper';

export default function Index() {
	useEffect(() => {
		document.title = 'Production Report S&M';
	}, []);

	return (
		<div className='space-y-6'>
			<Zipper />
			<Thread />
			<ThreadPartyWise />
		</div>
	);
}
