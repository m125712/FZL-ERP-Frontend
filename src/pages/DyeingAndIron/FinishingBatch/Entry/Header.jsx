import { useOtherOrderDescription } from '@/state/Other';
import { useParams } from 'react-router-dom';

import { DateInput } from '@/ui/Core';
import {
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
	watch,
}) {
	const { batch_uuid } = useParams();
	const { data: orders } = useOtherOrderDescription(
		'dyed_tape_required=false&swatch_approved=true'
	);
	const statuses = [
		{ value: 'running', label: 'Running' },
		{ value: 'completed', label: 'Completed' },
		{ value: 'hold', label: 'Hold' },
		{ value: 'rejected ', label: 'Rejected ' },
	];
	return (
		<div>
			<SectionEntryBody
				title={
					watch('batch_number')
						? 'Update Batch -> ' + watch('batch_number')
						: 'New Batch Entry'
				}>
				<div className='grid grid-cols-2 gap-4'>
					<FormField
						label='order_description_uuid'
						title='Order No'
						errors={errors}>
						<Controller
							name='order_description_uuid'
							control={control}
							render={({ field: { onChange } }) => {
								return (
									<ReactSelect
										placeholder='Select Order No'
										options={orders}
										value={orders?.find(
											(item) =>
												item.value ==
												getValues(
													'order_description_uuid'
												)
										)}
										onChange={(e) => {
											onChange(e.value);
										}}
										isDisabled={batch_uuid != undefined}
									/>
								);
							}}
						/>
					</FormField>
					<FormField label='status' title='Status' errors={errors}>
						<Controller
							name='status'
							control={control}
							render={({ field: { onChange } }) => {
								return (
									<ReactSelect
										placeholder='Select Marketing'
										options={statuses}
										value={statuses?.find(
											(item) =>
												item.value ==
												getValues('status')
										)}
										onChange={(e) => {
											onChange(e.value);
										}}
										// isDisabled={pi_uuid != undefined}
									/>
								);
							}}
						/>
					</FormField>
				</div>
				<div className='flex gap-4'>
					<Input
						label='slider_lead_time'
						unit='PCS'
						{...{ register, errors }}
					/>
					<Input
						label='dyeing_lead_time'
						unit='KG'
						{...{ register, errors }}
					/>
					<DateInput
						label='production_date'
						Controller={Controller}
						control={control}
						selected={watch('production_date')}
						{...{ register, errors }}
					/>
				</div>
				<Textarea label='remarks' {...{ register, errors }} />
			</SectionEntryBody>
		</div>
	);
}
