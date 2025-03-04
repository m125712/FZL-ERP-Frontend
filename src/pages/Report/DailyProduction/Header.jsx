import { format } from 'date-fns';

import {
	FormField,
	ReactSelect,
	SectionEntryBody,
	SimpleDatePicker,
} from '@/ui';

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
		{ label: 'Bulk', value: 'bulk' },
		{ label: 'Sample', value: 'sample' },
	];

	return (
		<div>
			<SectionEntryBody title={'Daily Production Report'}>
				<div className='flex gap-2'>
					<FormField label='' title='From'>
						<SimpleDatePicker
							key={'from'}
							value={from}
							placeholder='From'
							onChange={(data) => {
								setFrom(data);
							}}
							selected={from}
						/>
					</FormField>
					<FormField label='' title='To'>
						<SimpleDatePicker
							key={'to'}
							value={to}
							placeholder='To'
							onChange={(data) => {
								setTo(data);
							}}
							selected={to}
						/>
					</FormField>
					<FormField label='' title='Type'>
						<ReactSelect
							placeholder='Select Type'
							options={types}
							value={types?.find((item) => item.value == type)}
							onChange={(e) => {
								setType(e.value);
							}}
						/>
					</FormField>
				</div>
			</SectionEntryBody>
		</div>
	);
}
