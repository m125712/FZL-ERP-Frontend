import {
	FormField,
	ReactSelect,
	SectionEntryBody,
	SimpleDatePicker,
} from '@/ui';

const noop = () => {};

export default function Header({
	from = '',
	setFrom = noop,
	to = '',
	setTo = noop,
	type = '',
	setType = noop,
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
							selected={from}
							onChangeForTime={(data) => {
								setFrom(data);
							}}
							showTime={true}
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
							showTime={true}
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
