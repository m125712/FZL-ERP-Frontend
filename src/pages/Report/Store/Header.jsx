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
			<SectionEntryBody title={'Stock Report'}>
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
					disabled={from ? false : true}
					onChange={(data) => {
						setTo(format(data, 'yyyy-MM-dd'));
					}}
				/>
			</SectionEntryBody>
		</div>
	);
}
