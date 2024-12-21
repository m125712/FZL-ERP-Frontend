import { useEffect, useState } from 'react';
import {
	useGetURLData,
	useOtherHRUserByDesignation,
	useOtherMachinesWithSlot,
} from '@/state/Other';
import { format } from 'date-fns';

import { DateInput } from '@/ui/Core';
import {
	FormField,
	Input,
	ReactSelect,
	SectionEntryBody,
	Textarea,
} from '@/ui';

import cn from '@/lib/cn';

export default function Header({
	register,
	errors,
	control,
	getValues,
	watch,
	Controller,
	totalQuantity,
	totalWeight,
}) {
	// ? since there the required designation is not in the database..
	// ? this is a workaround, where we use all the hr users
	const { data: dyeing_operator_option } = useOtherHRUserByDesignation();
	const { data: pass_by_option } = useOtherHRUserByDesignation();
	const { data: dyeing_supervisor_option } = useOtherHRUserByDesignation();

	const { data: batch_number } = useGetURLData(
		`/other/thread/batch/value/label`
	);
	const [slot, setSlot] = useState([]);

	// getting machine and available slots for it for the given date
	const { data: machine } = useOtherMachinesWithSlot(
		watch('production_date')
			? format(new Date(watch('production_date')), 'yyyy-MM-dd')
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

	const reasonOption = [
		{
			label: 'MC_pressure problem ect',
			value: 'mc_pressure_problem_ect',
		},
		{ label: 'Other', value: 'other' },
	];
	const categoryOption = [
		{ label: 'Light', value: 'light' },
		{ label: 'Medium', value: 'medium' },
		{ label: 'Deep', value: 'deep' },
	];

	const statusOption = [
		{ value: 'pending', label: 'Pending' },
		{ value: 'completed', label: 'Completed' },
		{ value: 'cancelled', label: 'Cancelled' },
	];
	const shiftOption = [
		{ label: 'A', value: 'a' },
		{ label: 'B', value: 'b' },
		{ label: 'C', value: 'c' },
		{ label: 'D', value: 'd' },
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
							)}>{`Batch QTY (KG): ${Number(totalWeight).toFixed(3)}`}</span>
						<br />
						<span>{`Batch QTY (Cone): ${totalQuantity}`}</span>
						<br />
					</div>
				}>
				<div className='flex gap-4'>
					<div className='flex flex-1 flex-col gap-2'>
						<FormField
							label='uuid'
							title='Batch No'
							errors={errors}>
							<Controller
								name='uuid'
								control={control}
								render={({ field: { onChange } }) => {
									return (
										<ReactSelect
											placeholder='Select Batch'
											options={batch_number}
											value={batch_number?.find(
												(item) =>
													item.value ==
													getValues('uuid')
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
													item.value ==
													getValues('slot')
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
					</div>
					<div className='flex flex-1 flex-col gap-2'>
						<Input
							label='yarn_quantity'
							disabled={true}
							{...{ register, errors }}
						/>
						<FormField
							label='reason'
							title='Reason'
							errors={errors}>
							<Controller
								name={'reason'}
								control={control}
								render={({ field: { onChange } }) => {
									return (
										<ReactSelect
											placeholder='Reason'
											options={reasonOption}
											value={reasonOption?.find(
												(item) =>
													item.value ===
													getValues('reason')
											)}
											onChange={(e) => {
												onChange(e.value);
											}}
										/>
									);
								}}
							/>
						</FormField>

						<FormField
							label='dyeing_operator'
							title='Operator'
							errors={errors}>
							<Controller
								name={'dyeing_operator'}
								control={control}
								render={({ field: { onChange } }) => {
									return (
										<ReactSelect
											placeholder='Select Dyeing Operator'
											options={dyeing_operator_option}
											value={dyeing_operator_option?.find(
												(item) =>
													item.value ===
													getValues('dyeing_operator')
											)}
											onChange={(e) => {
												onChange(e.value);
											}}
										/>
									);
								}}
							/>
						</FormField>
						<FormField
							label='status'
							title='Status'
							errors={errors}>
							<Controller
								name={'status'}
								control={control}
								render={({ field: { onChange } }) => {
									return (
										<ReactSelect
											placeholder='Select Status'
											options={statusOption}
											value={statusOption?.find(
												(item) =>
													item.value ===
													getValues('status')
											)}
											onChange={(e) => {
												onChange(e.value);
											}}
										/>
									);
								}}
							/>
						</FormField>
					</div>
					<div className='flex flex-1 flex-col gap-2'>
						<FormField
							label='category'
							title='Category'
							errors={errors}>
							<Controller
								name={'category'}
								control={control}
								render={({ field: { onChange } }) => {
									return (
										<ReactSelect
											placeholder='Select Category'
											options={categoryOption}
											value={categoryOption?.find(
												(item) =>
													item.value ===
													getValues('category')
											)}
											onChange={(e) => {
												onChange(e.value);
											}}
										/>
									);
								}}
							/>
						</FormField>
						<FormField
							label='pass_by'
							title='Pass By'
							errors={errors}>
							<Controller
								name={'pass_by'}
								control={control}
								render={({ field: { onChange } }) => {
									return (
										<ReactSelect
											placeholder='Pass By'
											options={pass_by_option}
											value={pass_by_option?.find(
												(item) =>
													item.value ===
													getValues('pass_by')
											)}
											onChange={(e) => {
												onChange(e.value);
											}}
										/>
									);
								}}
							/>
						</FormField>
						<FormField label='shift' title='Shift' errors={errors}>
							<Controller
								name={'shift'}
								control={control}
								render={({ field: { onChange } }) => {
									return (
										<ReactSelect
											placeholder='Select Shift'
											options={shiftOption}
											value={shiftOption?.find(
												(item) =>
													item.value ===
													getValues('shift')
											)}
											onChange={(e) => {
												onChange(e.value);
											}}
										/>
									);
								}}
							/>
						</FormField>
						<FormField
							label='dyeing_supervisor'
							title='Supervisor'
							errors={errors}>
							<Controller
								name={'dyeing_supervisor'}
								control={control}
								render={({ field: { onChange } }) => {
									return (
										<ReactSelect
											placeholder='Select Dyeing Supervisor'
											options={dyeing_supervisor_option}
											value={dyeing_supervisor_option?.find(
												(item) =>
													item.value ===
													getValues(
														'dyeing_supervisor'
													)
											)}
											onChange={(e) => {
												onChange(e.value);
											}}
										/>
									);
								}}
							/>
						</FormField>
					</div>
				</div>
				<div className='flex flex-col gap-1 px-2 text-secondary-content md:flex-row'>
					<Textarea label='remarks' {...{ register, errors }} />
				</div>
			</SectionEntryBody>
		</div>
	);
}
