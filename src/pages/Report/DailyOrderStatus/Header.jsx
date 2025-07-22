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
}) {
	return (
		<div>
			<SectionEntryBody title={'Daily Order Status'}>
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
				</div>
			</SectionEntryBody>
		</div>
	);
}
