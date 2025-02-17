import { format } from 'date-fns';

import { ReactSelect, SectionEntryBody, SimpleDatePicker } from '@/ui';

export default function Header({
	from = '',
	setFrom = () => {},
	to = '',
	setTo = () => {},
	type = '',
	setType = () => {},
}) {
	const types = [
		{ label: 'All', value: 'all' },
		{ label: 'Bulk', value: 'nulk' },
		{ label: 'Sample', value: 'sample' },
	];

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
				<ReactSelect
					placeholder='Select Type'
					options={types}
					value={types?.find((item) => item.value == type)}
					onChange={(e) => {
						setType(e.value);
					}}
				/>
			</SectionEntryBody>
		</div>
	);
}
