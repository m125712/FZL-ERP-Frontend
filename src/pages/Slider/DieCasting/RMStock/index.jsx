import { useEffect } from 'react';

import { RmIndex } from '@/components/Common';

import PageInfo from '@/util/PageInfo';
import { getTransactionAreaSliderDieCasting } from '@/util/TransactionArea';

export default function Index() {
	const info = new PageInfo(
		'Die Casting RM Stock',
		'slider/die-casting/rm',
		'slider__die_casting_rm'
	);

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	return (
		<div>
			<RmIndex trxArea={getTransactionAreaSliderDieCasting} info={info} />
		</div>
	);
}
