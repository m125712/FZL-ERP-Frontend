import { RmLogIndex } from '@/components/Common';

import PageInfo from '@/util/PageInfo';
import { getTransactionAreaMetallicFinishing } from '@/util/TransactionArea';

export default function Index() {
	const info = new PageInfo(
		'Finishing RM Used Log',
		'nylon/metallic-finishing/log',
		'nylon__metallic_finishing_log'
	);

	return (
		<div>
			<RmLogIndex
				trxArea={getTransactionAreaMetallicFinishing}
				info={info}
			/>
		</div>
	);
}
