import { parseISO } from 'date-fns';

import { DateInput } from '@/ui/Core';
import SwitchToggle from '@/ui/Others/SwitchToggle';
import { FormField, SectionEntryBody, Textarea } from '@/ui';

export default function Header({
	register,
	errors,
	getValues,
	control,
	isUpdate,
	watch,
	Controller,
}) {
	return (
		<SectionEntryBody
			title={
				isUpdate
					? `Utility Information - ${getValues('utility_id') || 'Update'}`
					: 'New Utility Information'
			}
			className={'grid grid-cols-2 gap-4'}
		>
			<div className='flex gap-2'>
				<FormField label='off_day' title='Off Day' errors={errors}>
					<Controller
						name={'off_day'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<SwitchToggle
									onChange={(e) => {
										onChange(e);
									}}
									checked={getValues('off_day')}
								/>
							);
						}}
					/>
				</FormField>
				<DateInput
					label='date'
					Controller={Controller}
					control={control}
					selected={watch('date') ? parseISO(watch('date')) : null}
					{...{ register, errors }}
				/>
				<DateInput
					label='previous_date'
					Controller={Controller}
					control={control}
					selected={
						watch('previous_date')
							? parseISO(watch('previous_date'))
							: null
					}
					{...{ register, errors }}
				/>
			</div>

			<Textarea label='remarks' register={register} errors={errors} />
		</SectionEntryBody>
	);
}
