import { useEffect } from 'react';

import { RmIndex } from '@/components/Common';

import PageInfo from '@/util/PageInfo';
import { getTransactionAreaMetallicFinishing } from '@/util/TransactionArea';

export default function Index() {
	const info = new PageInfo(
		'Finishing RM Stock',
		'nylon/metallic-finishing/rm',
		'nylon__metallic_finishing_rm'
	);

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	return (
		<div>
			<RmIndex
				trxArea={getTransactionAreaMetallicFinishing}
				info={info}
			/>
		</div>
	);
}
