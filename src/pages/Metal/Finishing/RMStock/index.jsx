import { useEffect } from 'react';

import { RmIndex } from '@/components/Common';

import PageInfo from '@/util/PageInfo';
import { getTransactionAreaMetalFinishing } from '@/util/TransactionArea';

export default function Index() {
	const info = new PageInfo(
		'Metal Finishing RM Stock',
		'metal/finishing/rm',
		'metal__finishing_rm'
	);

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	return (
		<div>
			<RmIndex trxArea={getTransactionAreaMetalFinishing} info={info} />
		</div>
	);
}
