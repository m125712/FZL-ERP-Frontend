import { ReactSelect, SectionEntryBody } from '@/ui';

export default function Header({ type, setType }) {
	const types = [
		{ label: 'Handover', value: 'handover=true' },
		{ label: 'Acceptance', value: 'acceptance=true' },
		{ label: 'Maturity', value: 'maturity=true' },
		{ label: 'All', value: 'all=true' },
	];

	return (
		<div className='mb-5 flex flex-col gap-4'>
			<SectionEntryBody title={'Select Date & Type'}>
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
