import { useEffect } from 'react';

import { RmIndex } from '@/components/Common';

import PageInfo from '@/util/PageInfo';
import { getTransactionAreaMetalTeethColoring } from '@/util/TransactionArea';
export default function Index() {
	const info = new PageInfo(
		'Metal Teeth Coloring RM Stock',
		'metal/teeth-coloring/rm',
		'metal__teeth_coloring_rm'
	);

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	return (
		<div>
			<RmIndex
				trxArea={getTransactionAreaMetalTeethColoring}
				info={info}
			/>
		</div>
	);
}
