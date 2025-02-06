import { RmLogIndex } from '@/components/Common';

import PageInfo from '@/util/PageInfo';
import { getTransactionAreaTapePreparationTape } from '@/util/TransactionArea';

export default function Index() {
	const info = new PageInfo(
		'Raw Material Used',
		'common/tape/log',
		'common__tape_log'
	);

	return (
		<div>
			<RmLogIndex
				trxArea={getTransactionAreaTapePreparationTape}
				info={info}
			/>
		</div>
	);
}
