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
			<SectionEntryBody title={'Production Statement Report'}>
				<SimpleDatePicker
					key={'from'}
					value={from}
					placeholder='From'
					onChange={(data) => {
						setFrom(format(data, 'yyyy-MM-dd'));
					}}
				/>
				<SimpleDatePicker
					key={'to'}
					value={to}
					placeholder='To'
					onChange={(data) => {
						setTo(format(data, 'yyyy-MM-dd'));
					}}
				/>
			</SectionEntryBody>
		</div>
	);
}
