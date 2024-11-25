import { useOtherMachines } from '@/state/Other';

import { FormField, ReactSelect, SectionEntryBody, Textarea } from '@/ui';

import cn from '@/lib/cn';

import { slot } from '../utils';
import { DateInput } from '@/ui/Core';

export default function Header({
	Controller,
	register,
	errors,
	control,
	watch,
	getValues,
	totalQuantity,
	totalCalTape,
}) {
	const { data: machine } = useOtherMachines();

	const res = machine?.find(
		(item) => item.value == getValues('machine_uuid')
	);

	return (
		<div className='flex flex-col gap-4'>
			<SectionEntryBody
				title={
					<div>
						<span>{`${getValues('batch_id') ? `Batch ID: ${getValues('batch_id')}` : 'Entry New Batch'}`}</span>
						<br />
						<span>{`Machine Capacity (KG): ${res?.min_capacity || 0} - 
														${res?.max_capacity || 0}`}</span>
						<br />
						<span
							className={cn(
								totalCalTape > parseFloat(res?.max_capacity) ||
									totalCalTape < parseFloat(res?.min_capacity)
									? 'text-error'
									: ''
							)}>{`Batch Quantity (KG): ${Number(totalCalTape).toFixed(3)}`}</span>
						<br />
						<span>{`Batch Quantity (PCS): ${totalQuantity}`}</span>
					</div>
				}>
				<div className='flex flex-col gap-1 px-2 text-secondary-content md:flex-row'>
					<FormField
						label='machine_uuid'
						title='Machine'
						errors={errors}>
						<Controller
							name='machine_uuid'
							control={control}
							render={({ field: { onChange } }) => {
								return (
									<ReactSelect
										placeholder='Select Machine'
										options={machine}
										value={machine?.find(
											(item) =>
												item.value ==
												getValues('machine_uuid')
										)}
										onChange={(e) => {
											const value = e.value;
											onChange(value);
										}}
									/>
								);
							}}
						/>
					</FormField>
					<FormField label='slot' title='Slot' errors={errors}>
						<Controller
							name='slot'
							control={control}
							render={({ field: { onChange } }) => {
								return (
									<ReactSelect
										placeholder='Select Slot'
										options={slot}
										value={slot?.find(
											(item) =>
												item.value == getValues('slot')
										)}
										onChange={(e) => {
											const value = e.value;
											onChange(value);
										}}
									/>
								);
							}}
						/>
					</FormField>
					<DateInput
						label='production_date'
						Controller={Controller}
						control={control}
						selected={watch('production_date')}
						{...{ register, errors }}
					/>
					<Textarea label='remarks' {...{ register, errors }} />
				</div>
			</SectionEntryBody>
		</div>
	);
}
