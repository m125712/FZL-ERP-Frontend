import { RmLogIndex } from '@/components/Common';

import PageInfo from '@/util/PageInfo';
import { getTransactionAreaSliderDieCasting } from '@/util/TransactionArea';

export default function Index() {
	const info = new PageInfo(
		'RM Die Casting Log',
		'slider/die-casting/log',
		'slider__die_casting_log'
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
