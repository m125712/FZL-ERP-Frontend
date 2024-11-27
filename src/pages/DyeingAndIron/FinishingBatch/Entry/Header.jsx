import { useState } from 'react';
import { useGetURLData, useOtherOrderDescription } from '@/state/Other';
import { format, set } from 'date-fns';
import { useParams } from 'react-router-dom';

import { DateInput } from '@/ui/Core';
import {
	FormField,
	Input,
	ReactSelect,
	SectionEntryBody,
	Textarea,
} from '@/ui';

import TableView from './TableView';

export default function Header({
	register,
	errors,
	control,
	getValues,
	Controller,
	watch,
	orderType = '',
	setOrderType,
}) {
	const { batch_uuid } = useParams();
	const { data: orders } = useOtherOrderDescription(
		'dyed_tape_required=false&swatch_approved=true&is_balance=true'
	);
	const statuses = [
		{ value: 'running', label: 'Running' },
		{ value: 'completed', label: 'Completed' },
		{ value: 'hold', label: 'Hold' },
		{ value: 'rejected ', label: 'Rejected ' },
	];

	const { data: qty } = useGetURLData(
		`/zipper/finishing-batch-entry/production-quantity/max/${watch('order_description_uuid')}?production_date=${watch('production_date') ? format(watch('production_date'), 'yyyy-MM-dd') : ''}`,
		{
			enabled: !!(
				watch('order_description_uuid') && watch('production_date')
			),
		}
	);

	return (
		<div className='flex flex-col gap-8'>
			<TableView data={orders} />
			<SectionEntryBody
				title={
					<div className='flex flex-col gap-4'>
						<span className='text-xl'>
							{watch('batch_number')
								? 'Update Batch -> ' + watch('batch_number')
								: 'New Batch Entry'}
						</span>

						<span className='text-sm'>
							Total Production Capacity:{' '}
							{qty?.total_production_capacity}
						</span>
					</div>
				}>
				<div className='grid grid-cols-2 gap-4'>
					<DateInput
						label='production_date'
						Controller={Controller}
						control={control}
						selected={watch('production_date')}
						{...{ register, errors }}
					/>

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
											setOrderType(e.order_type);
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
					<Input
						label='slider_lead_time'
						unit='PCS'
						{...{ register, errors }}
					/>
					{orderType !== 'slider' && (
						<Input
							label='dyeing_lead_time'
							unit='KG'
							{...{ register, errors }}
						/>
					)}
				</div>
				<Textarea label='remarks' {...{ register, errors }} />
			</SectionEntryBody>
		</div>
	);
}
