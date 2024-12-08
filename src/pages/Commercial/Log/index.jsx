import { useEffect } from 'react';

import ReceiveAmount from './ReceiveAmoutLog';

export default function Index() {
	useEffect(() => {
		document.title = 'Coil Log';
	}, []);
	return (
		<div>
			<ReceiveAmount />
		</div>
	);
}
