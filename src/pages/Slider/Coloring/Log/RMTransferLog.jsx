import { RmLogIndex } from '@/components/Common';

import PageInfo from '@/util/PageInfo';
import { getTransactionAreaSliderColoring } from '@/util/TransactionArea';

export default function Index() {
	const info = new PageInfo(
		'RM Coloring Log',
		'slider/slider-coloring/log',
		'slider__coloring_log'
	);

	return (
		<div>
			<RmLogIndex
				trxArea={getTransactionAreaSliderColoring}
				info={info}
			/>
		</div>
	);
}
