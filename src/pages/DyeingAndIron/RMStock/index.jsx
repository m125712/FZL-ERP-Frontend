import { useEffect } from 'react';

import { RmIndex } from '@/components/Common';

import PageInfo from '@/util/PageInfo';
import { getTransactionAreaDyeing } from '@/util/TransactionArea';

export default function Index() {
	const info = new PageInfo(
		'Dyeing/RM',
		'dyeing-and-iron/rm',
		'dyeing__dyeing_and_iron_rm'
	);

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	return (
		<div>
			<RmIndex trxArea={getTransactionAreaDyeing} info={info} />
		</div>
	);
}
