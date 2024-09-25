import { useFetch } from '@/hooks';

import { FormField, ReactSelect, SectionEntryBody, Textarea } from '@/ui';

import cn from '@/lib/cn';

import { slot } from '../utils';

export default function Header({
	Controller,
	register,
	errors,
	control,
	getValues,
	totalQuantity,
	totalCalTape,
}) {
	const { value: machine } = useFetch('/other/machine/value/label');

	const res = machine?.find(
		(item) => item.value == getValues('machine_uuid')
	);

	return (
		<div className='flex flex-col gap-4'>
			<SectionEntryBody
				title={
					<div>
						<span>{`Machine Capacity (KG): ${Number(res?.min_capacity || 0).toFixed(2)} - 
														${Number(res?.max_capacity || 0).toFixed(2)}`}</span>
						<br />
						<span
							className={cn(
								totalCalTape > parseFloat(res?.max_capacity) ||
									totalCalTape < parseFloat(res?.min_capacity)
									? 'text-error'
									: ''
							)}>{`Batch Quantity (KG): ${totalCalTape}`}</span>
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
					<Textarea label='remarks' {...{ register, errors }} />
				</div>
			</SectionEntryBody>
		</div>
	);
}
