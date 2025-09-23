import { ReactSelect, SectionEntryBody } from '@/ui';

export const types = [
	{ label: 'Acceptance Due', value: 'acceptance=true' },
	{ label: 'Maturity Due', value: 'maturity=true' },
	{ label: 'In Production', value: 'all=true' },
];
export default function Header({ type, setType }) {
	return (
		<div className='mb-5 flex flex-col gap-4'>
			<SectionEntryBody title={'LC Fort Night'}>
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
