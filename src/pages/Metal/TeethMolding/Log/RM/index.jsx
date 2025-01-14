import { RmLogIndex } from '@/components/Common';

import PageInfo from '@/util/PageInfo';
import { getTransactionAreaMetalTeethMolding } from '@/util/TransactionArea';

export default function Index() {

	const info = new PageInfo(
		'Teeth Molding RM Used Log',
		'metal/teeth-coloring/log',
		'metal__teeth_molding_log'
	);

	return (
		<div>
			<RmLogIndex
				trxArea={getTransactionAreaMetalTeethMolding}
				info={info}
			/>
		</div>
	);
}
