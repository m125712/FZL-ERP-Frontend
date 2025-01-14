import { RmLogIndex } from '@/components/Common';

import PageInfo from '@/util/PageInfo';
import { getTransactionAreaMetalTeethColoring } from '@/util/TransactionArea';

export default function Index() {
	const info = new PageInfo(
		'RM TeethColoring Log',
		'metal/teeth-coloring/log',
		'metal__teeth_coloring_log'
	);

	return (
		<div>
			<RmLogIndex
				trxArea={getTransactionAreaMetalTeethColoring}
				info={info}
			/>
		</div>
	);
}
