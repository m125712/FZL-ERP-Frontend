import { format } from 'date-fns';

import { SectionEntryBody, SimpleDatePicker } from '@/ui';

export default function Header({
	from = '',
	setFrom = () => {},
	to = '',
	setTo = () => {},
}) {
	return (
		<div>
			<SectionEntryBody title={'Daily Production Report'}>
				<SimpleDatePicker
					key={'from'}
					value={from}
					placeholder='From'
					onChange={(data) => {
						setFrom(format(data, 'yyyy-MM-dd'));
					}}
					selected={from}
				/>
			</SectionEntryBody>
		</div>
	);
}
