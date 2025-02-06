import { useEffect } from 'react';

import { RmIndex } from '@/components/Common';

import PageInfo from '@/util/PageInfo';
import { getTransactionAreaVislonFinishing } from '@/util/TransactionArea';

export default function Index() {
	const info = new PageInfo(
		'Finishing RM Stock',
		'vislon/finishing/rm',
		'vislon__finishing_rm'
	);

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	return (
		<div>
			<RmIndex trxArea={getTransactionAreaVislonFinishing} info={info} />
		</div>
	);
}
