import { RmLogIndex } from '@/components/Common';

import PageInfo from '@/util/PageInfo';
import { getTransactionAreaVislonFinishing } from '@/util/TransactionArea';

export default function Index() {
	const info = new PageInfo(
		'Finishing RM Used Log',
		'vislon/finishing/log',
		'vislon__finishing_log'
	);

	return (
		<div>
			<RmLogIndex
				trxArea={getTransactionAreaVislonFinishing}
				info={info}
			/>
		</div>
	);
}
