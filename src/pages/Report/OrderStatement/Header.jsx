import { format } from 'date-fns';

import { FormField, SectionEntryBody, SimpleDatePicker } from '@/ui';

export default function Header({ date = '', setDate = () => {} }) {
	return (
		<div>
			<SectionEntryBody title={'Order Statement Report'}>
				<div className='flex gap-2'>
					<FormField label='' title='From'>
						<SimpleDatePicker
							key={'date'}
							value={date}
							placeholder='From'
							onChange={(data) => {
								setDate(format(data, 'yyyy-MM-dd'));
							}}
						/>
					</FormField>
				</div>
			</SectionEntryBody>
		</div>
	);
}
