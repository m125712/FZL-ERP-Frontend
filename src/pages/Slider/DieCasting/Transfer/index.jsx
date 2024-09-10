import { useEffect } from 'react';
import AgainstStock from './AgainstStock';
import AgainstOrder from './AgainstOrder.jsx';

export default function Index() {
	useEffect(() => {
		document.title = 'Die Casting Transfer';
	}, []);
	return (
		<div>
			<AgainstStock />
			<hr className='my-6 border-2 border-dashed border-secondary-content' />
			<AgainstOrder />
		</div>
	);
}
