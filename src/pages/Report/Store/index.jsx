import { useEffect } from 'react';

import PageInfo from '@/util/PageInfo';

import Store from './Store';

export default function index() {
	const info = new PageInfo('Store', null, 'report__store');

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	return (
		<div className='flex flex-col gap-8'>
			<Store />
		</div>
	);
}
