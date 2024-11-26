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
					onChange={(data) => {
						setFrom(format(data, 'yyyy-MM-dd'));
					}}
				/>
				<SimpleDatePicker
					value={to}
					onChange={(data) => {
						setTo(format(data, 'yyyy-MM-dd'));
					}}
				/>
			</SectionEntryBody>
		</div>
	);
}
