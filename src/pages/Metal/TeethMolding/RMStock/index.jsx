import { useEffect } from 'react';

import { RmIndex } from '@/components/Common';

import PageInfo from '@/util/PageInfo';
import { getTransactionAreaMetalTeethMolding } from '@/util/TransactionArea';

export default function Index() {
	const info = new PageInfo(
		'Teeth Molding RM Stock',
		'metal/teeth-coloring/rm',
		'metal__teeth_molding_rm'
	);

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	return (
		<div>
			<RmIndex
				trxArea={getTransactionAreaMetalTeethMolding}
				info={info}
			/>
		</div>
	);
}
