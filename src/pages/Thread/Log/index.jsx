import { useEffect } from 'react';

import Production from './Production';

export default function Index() {
	useEffect(() => {
		document.title = 'Thread: Log';
	}, []);
	return <Production />;
}
