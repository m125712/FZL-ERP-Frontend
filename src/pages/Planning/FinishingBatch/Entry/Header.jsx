import {
	useGetURLData,
	useOtherOrderDescription,
	useOtherPlanningBatchByDate,
} from '@/state/Other';
import { format } from 'date-fns';
import { useParams } from 'react-router-dom';

import { DateInput } from '@/ui/Core';
import {
	FormField,
	JoinInput,
	ReactSelect,
	SectionEntryBody,
	Textarea,
} from '@/ui';

import { cn } from '@/lib/utils';

import QuantityCard from './quantity-card';

export default function Header({
	register,
	errors,
	control,
	getValues,
	Controller,
	watch,
	orderType = '',
	setOrderType,
	sliderType = '',
	setSliderType,
	setEndType,
	isUpdate,
}) {
	const { batch_uuid } = useParams();
	const { originalData } = useOtherOrderDescription(
		`dyed_tape_required=false&swatch_approved=true&is_balance=true&is_update=${isUpdate}`
	);
	const statuses = [
		{ value: 'running', label: 'Running' },
		{ value: 'completed', label: 'Completed' },
		{ value: 'hold', label: 'Hold' },
		{ value: 'rejected ', label: 'Rejected ' },
	];

	const { data: batches } = useOtherPlanningBatchByDate(
		watch('production_date')
			? format(watch('production_date'), 'yyyy-MM-dd')
			: '',
		watch('order_description_uuid'),
		!!(watch('order_description_uuid') && watch('production_date'))
	);

	// const { data: qty } = useGetURLData(
	// 	`/zipper/finishing-batch-entry/production-quantity/max/${watch('order_description_uuid')}?production_date=${watch('production_date') ? format(watch('production_date'), 'yyyy-MM-dd') : ''}`,
	// 	{
	// 		enabled: !!(
	// 			watch('order_description_uuid') && watch('production_date')
	// 		),
	// 	}
	// );

	return (
		<div className='flex flex-col gap-8'>
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
							{batches?.production_capacity_quantity}
						</span>
					</div>
				}
				className='grid grid-cols-3 gap-4'
			>
				<div
					className={cn(
						'col-span-2 grid grid-cols-1 gap-4 md:grid-cols-3'
					)}
				>
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
						errors={errors}
						className={'col-span-2'}
					>
						<Controller
							name='order_description_uuid'
							control={control}
							render={({ field: { onChange } }) => {
								return (
									<ReactSelect
										placeholder='Select Order No'
										options={originalData?.data}
										value={originalData?.data?.find(
											(item) =>
												item.value ==
												getValues(
													'order_description_uuid'
												)
										)}
										onChange={(e) => {
											onChange(e.value);
											setOrderType(e.order_type);
											setSliderType(e.slider_provided);
											setEndType(e.end_type_name);
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
					{!(
						orderType === 'tape' ||
						sliderType === 'completely_provided'
					) && (
						<JoinInput
							label='slider_lead_time'
							unit='Days'
							{...{ register, errors }}
						/>
					)}
					{orderType !== 'slider' && (
						<JoinInput
							label='dyeing_lead_time'
							unit='Days'
							{...{ register, errors }}
						/>
					)}

					<div className='col-span-3'>
						<Textarea label='remarks' {...{ register, errors }} />
					</div>
				</div>
				<QuantityCard
					batch_numbers={batches?.batch_numbers}
					production_capacity_quantity={
						batches?.production_capacity_quantity
					}
				/>
			</SectionEntryBody>
		</div>
	);
}
