import { useEffect, useState } from 'react';
import {
	useOtherMachinesWithSlot,
	useOtherOrderInfoValueLabel,
} from '@/state/Other';
import { format } from 'date-fns';

import { DateInput } from '@/ui/Core';
import { FormField, ReactSelect, SectionEntryBody, Textarea } from '@/ui';

import cn from '@/lib/cn';

export default function Header({
	Controller,
	register,
	errors,
	control,
	watch,
	getValues,
	setValue,
	reset,
	totalQuantity,
	totalCalTape,
	isUpdate,
}) {
	const [slot, setSlot] = useState([]);

	// getting machine and available slots for it for the given date
	const { data: machine } = useOtherMachinesWithSlot(
		watch('production_date')
			? format(new Date(watch('production_date')), 'yyyy-MM-dd')
			: ''
	);

	const { data: orders } = useOtherOrderInfoValueLabel('page=dyeing_batch');

	const res = machine?.find(
		(item) => item.value == getValues('machine_uuid')
	);

	// filtering the machines with available slots in can_book is true
	// const filtered_machine = machine
	// 	? machine?.filter((item) => item.can_book == true)
	// 	: [];

	// setting the setSLot sate if the request is for update to show the options for slots
	useEffect(() => {
		if (isUpdate) {
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
		}
	}, [isUpdate, machine]);

	useEffect(() => {
		if (machine && watch('machine_uuid')) {
			const machineData = machine?.find(
				(item) => item.value == watch('machine_uuid')
			);

			if (machineData) {
				setSlot([
					// adding the current selected slot since it is not available in the fetched data
					{
						value: getValues('slot'),
						label: 'Slot ' + getValues('slot'),
					},
					...(machineData?.open_slot || []),
				]);
			}
		}
	}, [machine, watch('machine_uuid')]);

	const batchType = [
		{ value: 'normal', label: 'Normal' },
		{ value: 'extra', label: 'Extra' },
	];

	return (
		<div className='flex flex-col gap-4'>
			<SectionEntryBody
				header={
					<div className='flex w-full items-center justify-between py-2'>
						<div className='flex-1'>
							<span>{`${getValues('batch_id') ? `Batch ID: ${getValues('batch_id')}` : 'Entry New Batch'}`}</span>
							<br />
							<span>{`Machine Capacity (KG): ${res?.min_capacity || 0} - 
														${res?.max_capacity || 0}`}</span>
							<br />
							<span
								className={cn(
									totalCalTape >
										parseFloat(res?.max_capacity) ||
										totalCalTape <
											parseFloat(res?.min_capacity)
										? 'text-error'
										: ''
								)}
							>{`Batch Quantity (KG): ${Number(totalCalTape).toFixed(3)}`}</span>
							<br />
							<span>{`Batch Quantity (PCS): ${totalQuantity}`}</span>
						</div>
						<div className='flex w-[440px] gap-4 pr-4'>
							<FormField
								labelClassName={'text-white'}
								label='batch_type'
								title='Batch Type'
								errors={errors}
							>
								<Controller
									name='batch_type'
									control={control}
									render={({ field: { onChange } }) => {
										return (
											<ReactSelect
												placeholder='Select Batch Type'
												options={batchType}
												value={batchType?.filter(
													(item) =>
														item.value ==
														getValues('batch_type')
												)}
												onChange={(e) => {
													const value = e.value;
													onChange(value);
													if (value == 'normal') {
														setValue(
															'order_info_uuid',
															null
														);
													}
												}}
												isDisabled={isUpdate}
											/>
										);
									}}
								/>
							</FormField>
							<FormField
								label='order_info_uuid'
								title='O/N'
								labelClassName={'text-white'}
								errors={errors}
							>
								<Controller
									name='order_info_uuid'
									control={control}
									render={({ field: { onChange } }) => {
										return (
											<ReactSelect
												placeholder='Select O/N'
												options={orders}
												value={orders?.filter(
													(item) =>
														item.value ==
														getValues(
															'order_info_uuid'
														)
												)}
												onChange={(e) => {
													const value = e.value;
													onChange(value);
												}}
												isDisabled={
													isUpdate ||
													getValues('batch_type') ==
														'normal'
												}
											/>
										);
									}}
								/>
							</FormField>
						</div>
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
						anotherOnChange={(e) => {
							setValue('machine_uuid', null);
							setValue('slot', null);
						}}
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
										value={machine?.filter(
											(item) =>
												item.value ==
												getValues('machine_uuid')
										)}
										onChange={(e) => {
											const value = e.value;
											onChange(value);
											setSlot(e.open_slot);
											setValue('slot', null);
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
										value={slot?.filter(
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
