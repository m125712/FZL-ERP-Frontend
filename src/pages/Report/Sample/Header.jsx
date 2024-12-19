import { format } from 'date-fns';

import { SectionEntryBody, SimpleDatePicker } from '@/ui';

export default function Header({ date = '', setDate = () => {} }) {
	return (
		<div className='mb-5 flex flex-col gap-4'>
			<SectionEntryBody title={'Select Date'}>
				<SimpleDatePicker
					value={date}
					placeholder='Select Date'
					onChange={(data) => {
						setDate(format(data, 'yyyy-MM-dd'));
					}}
				/>
			</SectionEntryBody>
		</div>
	);
}
