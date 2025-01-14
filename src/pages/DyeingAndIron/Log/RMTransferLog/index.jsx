import { RmLogIndex } from '@/components/Common';

import PageInfo from '@/util/PageInfo';
import { getTransactionAreaDyeing } from '@/util/TransactionArea';

export default function Index() {
	const info = new PageInfo(
		'RM Dyeing Log',
		'dyeing-and-iron/log',
		'dyeing__dyeing_and_iron_log'
	);

	return (
		<div>
			<RmLogIndex trxArea={getTransactionAreaDyeing} info={info} />
		</div>
	);
}
