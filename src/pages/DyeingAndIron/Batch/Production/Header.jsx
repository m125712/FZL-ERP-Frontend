import { useFetch } from '@/hooks';
import {
	CheckBox,
	FormField,
	Input,
	ReactSelect,
	SectionEntryBody,
	Textarea,
} from '@/ui';

export default function Header({
	register,
	errors,
	control,
	getValues,
	Controller,
}) {
	const states = [
		{ value: 'pending', label: 'Pending' },
		{ value: 'completed', label: 'Completed' },
		{ value: 'cancelled', label: 'Cancelled' },
	];
	return (
		<div className='flex flex-col gap-4'>
			<SectionEntryBody title='Batch'>
				<div className='text-secondary-content flex flex-col gap-1 px-2 md:flex-row'>
					<Textarea
						label='remarks'
						{...{ register, errors }}
						disabled={true}
					/>

					<FormField
						label='Batch Status'
						title='Batch Status'
						errors={errors}>
						<Controller
							name={'batch_status'}
							control={control}
							render={({ field: { onChange } }) => {
								return (
									<ReactSelect
										label='Status'
										className='w-full'
										placeholder='Select Transaction Area'
										options={states}
										value={states?.find(
											(item) =>
												item.value ==
												getValues('batch_status')
										)}
										onChange={(e) => onChange(e.value)}
										isDisabled={false}
									/>
								);
							}}
						/>
					</FormField>
				</div>
			</SectionEntryBody>
		</div>
	);
}
