import { ReactSelect, SectionEntryBody } from '@/ui';

export default function Header({ due, setDue }) {
	const dues = [
		{
			value: '/report/lc-report?document_receiving=true',
			label: 'Document Receiving',
		},
		{ value: '/report/lc-report?maturity=true', label: 'Maturity Due' },
		{ value: '/report/lc-report?payment=true', label: 'Payment Due' },
	];
	return (
		<div className='mb-5 flex flex-col gap-4'>
			<SectionEntryBody title={'Select Due'}>
				<ReactSelect
					placeholder='Select LC Due'
					options={dues}
					value={dues?.find((item) => item.value == due)}
					onChange={(e) => {
						setDue(e.value);
					}}
				/>
			</SectionEntryBody>
		</div>
	);
}
