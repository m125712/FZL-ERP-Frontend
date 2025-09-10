import { ReactSelect, SectionEntryBody, SimpleDatePicker } from '@/ui';

export const types = [
	{ label: 'Over Due', value: 'over_due' },
	{ label: 'Current', value: 'current' },
	{ label: 'Push', value: 'push' },
];
export default function Header({ date, setDate, type, setType }) {
	return (
		<div className='mb-5 flex flex-col gap-4'>
			<SectionEntryBody title={'Select Date & Type'}>
				<SimpleDatePicker
					key={'date'}
					value={date}
					placeholder='Date'
					onChange={(data) => {
						setDate(data);
					}}
					selected={date}
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
