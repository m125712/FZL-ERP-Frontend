import { useEffect } from 'react';
import Order from '@/pages/Report/ProductionStatement/order';
import Production from '@/pages/Report/ProductionStatement/production';

import PageInfo from '@/util/PageInfo';

export default function index() {
	const info = new PageInfo(
		'Production Statement',
		null,
		'report__production_statement'
	);

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	return (
		<div className='flex flex-col gap-8'>
			<Production />
			<Order />
		</div>
	);
}
