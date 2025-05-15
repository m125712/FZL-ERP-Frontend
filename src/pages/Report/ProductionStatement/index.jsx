import { useEffect } from 'react';
import Order from '@/pages/Report/ProductionStatement/order';
import OrderV2 from '@/pages/Report/ProductionStatement/order-v2';
import Production from '@/pages/Report/ProductionStatement/production';
import ProductionV2 from '@/pages/Report/ProductionStatement/production-v2';

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
			{/* <Production /> */}
			<ProductionV2 />
			{/* <Order /> */}
			<OrderV2 />
		</div>
	);
}
