import { useEffect } from 'react';

import { RmIndex } from '@/components/Common';

import PageInfo from '@/util/PageInfo';
import { getTransactionAreaSliderColoring } from '@/util/TransactionArea';

export default function Index() {
	const info = new PageInfo(
		'Coloring RM Stock',
		'slider/slider-coloring/rm',
		'slider__coloring_rm'
	);

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	return (
		<div>
			<RmIndex trxArea={getTransactionAreaSliderColoring} info={info} />
		</div>
	);
}
