import { RmLogIndex } from '@/components/Common';

import PageInfo from '@/util/PageInfo';
import { getTransactionAreaTapePreparationCoil } from '@/util/TransactionArea';

export default function Index() {
	const info = new PageInfo(
		'Raw Material Used',
		'common/coil/log',
		'common__coil_log'
	);

	return (
		<div>
			<RmLogIndex
				trxArea={getTransactionAreaTapePreparationCoil}
				info={info}
			/>
		</div>
	);
}
