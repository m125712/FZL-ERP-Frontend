import { useState } from 'react';
import { useFetch } from '@/hooks';

import { FormField, ReactSelect, SectionEntryBody, Textarea } from '@/ui';

import cn from '@/lib/cn';

export default function Header({
	Controller,
	register,
	errors,
	control,
	getValues,
	totalQuantity,
	totalWeight,
}) {
	const { value: machine } = useFetch('/other/machine/value/label');
	const res = machine?.find(
		(item) => item.value == getValues('machine_uuid')
	);

	const slot = [
		{ label: 'Slot 1', value: 1 },
		{ label: 'Slot 2', value: 2 },
		{ label: 'Slot 3', value: 3 },
		{ label: 'Slot 4', value: 4 },
	];

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
								totalWeight > parseFloat(res?.max_capacity) ||
									totalWeight < parseFloat(res?.min_capacity)
									? 'text-error'
									: ''
							)}>{`Batch Quantity (KG): ${Number(totalWeight).toFixed(3)}`}</span>
						<br />
						<span>{`Batch Quantity (Cone): ${totalQuantity}`}</span>
						<br />
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
											// setMinCapacity(e.min_capacity);
											// setMaxCapacity(e.max_capacity);
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
