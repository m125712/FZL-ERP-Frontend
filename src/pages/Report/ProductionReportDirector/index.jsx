import { useEffect } from 'react';

import Thread from './thread';
import Zipper from './zipper';

export default function Index() {
	useEffect(() => {
		document.title = 'Production Report Director';
	}, []);

	return (
		<div>
			<Zipper />
			<hr className='my-6 border-2 border-dashed border-secondary/30' />
			<Thread />
		</div>
	);
}
