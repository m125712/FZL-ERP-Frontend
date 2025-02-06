import { useEffect } from 'react';

import { RmIndex } from '@/components/Common';

import PageInfo from '@/util/PageInfo';
import { getTransactionAreaTapePreparationTape } from '@/util/TransactionArea';

export default function Index() {
	const info = new PageInfo('Tape RM', 'common/tape/rm', 'common__tape_rm');

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	return (
		<div>
			<RmIndex
				trxArea={getTransactionAreaTapePreparationTape}
				info={info}
			/>
		</div>
	);
}
