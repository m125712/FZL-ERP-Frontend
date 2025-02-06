import { RmLogIndex } from '@/components/Common';

import PageInfo from '@/util/PageInfo';
import { getTransactionAreaThreadConning } from '@/util/TransactionArea';

export default function Index() {
	const info = new PageInfo('Thread Rm Log', '/thread/log', 'thread__log');

	return (
		<div>
			<RmLogIndex trxArea={getTransactionAreaThreadConning} info={info} />
		</div>
	);
}
