import { useEffect } from 'react';

import { RmIndex } from '@/components/Common';

import PageInfo from '@/util/PageInfo';
import { getTransactionAreaTapePreparationCoil } from '@/util/TransactionArea';

export default function Index() {
	const info = new PageInfo(
		'Coil Stock',
		'common/coil/rm',
		'common__coil_rm'
	);

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	return (
		<div>
			<RmIndex
				trxArea={getTransactionAreaTapePreparationCoil}
				info={info}
			/>
		</div>
	);
}
