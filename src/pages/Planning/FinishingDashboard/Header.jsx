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
			<SectionEntryBody title={'Finishing Dashboard'}>
				<SimpleDatePicker
					value={from}
					placeholder='From'
					onChange={(data) => {
						setFrom(format(data, 'yyyy-MM-dd'));
					}}
				/>
				<SimpleDatePicker
					value={to}
					placeholder='To'
					minDate={from}			
					disabled={from ? false : true}
					onChange={(data) => {
						setTo(format(data, 'yyyy-MM-dd'));
					}}
				/>
			</SectionEntryBody>
		</div>
	);
}
