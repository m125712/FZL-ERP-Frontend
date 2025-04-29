import { RmLogIndex } from '@/components/Common';

import PageInfo from '@/util/PageInfo';
import { getTransactionAreaSliderDieCasting } from '@/util/TransactionArea';

export default function Index() {
	const info = new PageInfo(
		'RM Making Log 1',
		'slider/making/log 1',
		'slider__making_log_1'
	);

	return (
		<div>
			<RmLogIndex
				trxArea={getTransactionAreaSliderDieCasting}
				info={info}
			/>
		</div>
	);
}
