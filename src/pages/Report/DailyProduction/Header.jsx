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
						setFrom(data);
					}}
					selected={from}
				/>
				<SimpleDatePicker
					key={'to'}
					value={to}
					placeholder='To'
					onChange={(data) => {
						setTo(data);
					}}
					selected={to}
				/>
			</SectionEntryBody>
		</div>
	);
}
