import { RmLogIndex } from '@/components/Common';

import PageInfo from '@/util/PageInfo';
import { getTransactionAreaMetalFinishing } from '@/util/TransactionArea';

export default function Index() {
	const info = new PageInfo(
		'Metal Finishing RM Used Log',
		'metal/finishing/log',
		'metal__finishing_log'
	);

	return (
		<div>
			<RmLogIndex
				trxArea={getTransactionAreaMetalFinishing}
				info={info}
			/>
		</div>
	);
}
