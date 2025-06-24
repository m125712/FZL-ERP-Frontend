import { useEffect, useState } from 'react';
import { useOtherMachinesWithSlot } from '@/state/Other';
import { formatDate } from 'date-fns';

import { DateInput } from '@/ui/Core';
import { FormField, ReactSelect, SectionEntryBody, Textarea } from '@/ui';

import cn from '@/lib/cn';

import { states } from '../utils';

export default function Header({
	register,
	errors,
	control,
	getValues,
	watch,
	Controller,
	totalQuantity,
	totalCalTape,
	totalProduction,
}) {
	const [slot, setSlot] = useState([]);

	// getting machine and available slots for it for the given date
	const { data: machine } = useOtherMachinesWithSlot(
		watch('production_date')
			? formatDate(new Date(watch('production_date')), 'yyyy-MM-dd')
			: ''
	);

	const res = machine?.find(
		(item) => item.value == getValues('machine_uuid')
	);

	// setting the setSLot sate if the request is for update to show the options for slots
	useEffect(() => {
		const tempSlot = machine?.find(
			(item) => item.value == getValues('machine_uuid')
		);

		// setting the setSLot sate
		setSlot([
			// adding the current selected slot since it is not available in the fetched data
			{
				value: getValues('slot'),
				label: 'Slot ' + getValues('slot'),
			},
			...(tempSlot?.open_slot || []),
		]);
	}, [machine]);

	return (
		<div className='flex flex-col gap-4'>
			<SectionEntryBody
				title={
					<div>
						<span>{`Batch ID: ${getValues('batch_id')}`}</span>
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
							)}
						>{`Batch Quantity (KG): ${Number(totalCalTape).toFixed(3)}`}</span>
						<br />
						<span
							className={cn(
								totalProduction > totalCalTape
									? 'text-error'
									: ''
							)}
						>{`Production Quantity (KG): ${Number(totalProduction).toFixed(3)}`}</span>
						<br />
						<span>{`Batch Quantity (PCS): ${totalQuantity}`}</span>
					</div>
				}
			>
				<div className='flex flex-col gap-1 px-2 text-secondary-content md:flex-row'>
					<DateInput
						label='production_date'
						Controller={Controller}
						control={control}
						selected={watch('production_date')}
						{...{ register, errors }}
						disabled={true}
					/>
					<FormField
						label='machine_uuid'
						title='Machine'
						errors={errors}
					>
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
											setSlot(e.open_slot);
										}}
										isDisabled={true}
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
										isDisabled={true}
									/>
								);
							}}
						/>
					</FormField>
					<Textarea
						label='remarks'
						{...{ register, errors }}
						disabled={true}
					/>
					<FormField
						label='Batch Status'
						title='Batch Status'
						errors={errors}
					>
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
