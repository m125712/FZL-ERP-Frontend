import { format } from 'date-fns';

import { FormField, SectionEntryBody, SimpleDatePicker } from '@/ui';

export default function Header({
	from = '',
	setFrom = () => {},
	to = '',
	setTo = () => {},
}) {
	return (
		<SectionEntryBody title={'Finishing Dashboard'}>
			<div className='flex gap-2'>
				<FormField label='' title='From'>
					<SimpleDatePicker
						key={'from'}
						value={from}
						placeholder='From'
						onChange={(data) => {
							setFrom(format(data, 'yyyy-MM-dd'));
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
							setTo(format(data, 'yyyy-MM-dd'));
						}}
						selected={to}
					/>
				</FormField>
			</div>
		</SectionEntryBody>
	);
}
