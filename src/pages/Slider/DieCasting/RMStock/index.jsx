import { useEffect } from 'react';

import { RmIndex } from '@/components/Common';

import PageInfo from '@/util/PageInfo';
import { getTransactionAreaSliderDieCasting } from '@/util/TransactionArea';

export default function Index() {
	const info = new PageInfo(
		'Making RM 1 Stock',
		'slider/making/rm_1',
		'slider__making_rm_1'
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
