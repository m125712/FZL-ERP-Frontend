import { useEffect } from 'react';

import PageInfo from '@/util/PageInfo';

import ItemWise from './ItemWise';
import ItemZipperEndWise from './ItemZipperEndWise';

export default function Index() {
	const info = new PageInfo(
		'Production Summary',
		'report/production-summary',
		'report__production_summary'
	);

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	return (
		<div className='flex flex-col gap-8'>
			<ItemWise />
			<ItemZipperEndWise />
		</div>
	);
}
