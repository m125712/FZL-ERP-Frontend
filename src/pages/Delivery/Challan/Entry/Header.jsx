import { useEffect } from 'react';
import {
	useOtherHRUserByDesignation,
	useOtherOrder,
	useOtherPackingListByOrderInfoUUID,
	useOtherPackingListByOrderInfoUUIDAndChallanUUID,
	useOtherVehicle,
	useThreadOrder,
} from '@/state/Other';
import { set } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';

import { DeleteModal } from '@/components/Modal';
import { DateInput } from '@/ui/Core';
import {
	CheckBox,
	FormField,
	Input,
	ReactSelect,
	SectionEntryBody,
	Textarea,
} from '@/ui';

import GetDateTime from '@/util/GetDateTime';
import isJSON from '@/util/isJson';
import { CHALLAN_NULL } from '@/util/Schema';

export default function Header({
	register,
	errors,
	control,
	getValues,
	Controller,
	isUpdate,
	watch,
	setValue,
	setDeleteItem,
	deleteItem,
}) {
	const { reset } = useForm();
	//* Vehicles Fetch
	const { data: vehicles } = useOtherVehicle();

	//* Orders Fetch
	const { data: ordersZipper } = isUpdate
		? useOtherOrder()
		: useOtherOrder('page=challan&item_for=zipper');
	const { data: ordersSlider } = isUpdate
		? useOtherOrder()
		: useOtherOrder('page=challan&item_for=slider');
	const { data: ordersTape } = isUpdate
		? useOtherOrder()
		: useOtherOrder('page=challan&item_for=tape');
	const { data: ordersThread } = isUpdate
		? useThreadOrder()
		: useThreadOrder('page=challan&item_for=thread');

	const { data: ordersZipperSample } = isUpdate
		? useOtherOrder('is_sample=true')
		: useOtherOrder('page=challan&is_sample=true');

	const { data: ordersThreadSample } = isUpdate
		? useThreadOrder('is_sample=true')
		: useThreadOrder('page=challan&is_sample=true');

	const itemFor = {
		zipper: ordersZipper,
		thread: ordersThread,
		sample_zipper: ordersZipperSample,
		sample_thread: ordersThreadSample,
		slider: ordersSlider,
		tape: ordersTape,
	};
	const orders = itemFor[watch('item_for')] || [];

	//* Packing List Fetch
	const { data: packingList, invalidateQuery: invalidatePackingList } =
		isUpdate
			? useOtherPackingListByOrderInfoUUIDAndChallanUUID(
					watch('order_info_uuid'),
					watch('uuid'),
					watch('item_for')
				)
			: useOtherPackingListByOrderInfoUUID(watch('order_info_uuid'));

	const itemOptions = [
		{ label: 'Zipper', value: 'zipper' },
		{ label: 'Thread', value: 'thread' },
		{ label: 'Zipper Sample', value: 'sample_zipper' },
		{ label: 'Thread Sample', value: 'sample_thread' },
		{ label: 'Slider', value: 'slider' },
		{ label: 'Tape', value: 'tape' },
	];

	useEffect(() => {
		if (!isUpdate) {
			setValue('order_info_uuid', null);
			setValue('packing_list_uuids', []);
			setValue('challan_entry', []);
		}
	}, [watch('item_for')]);

	const types = [
		{
			label: 'Own Delivery',
			value: 'own',
		},
		{
			label: 'Hand Delivery',
			value: 'hand',
		},
		{
			label: 'Normal Delivery',
			value: 'normal',
		},
	];

	useEffect(() => {
		if (watch('delivery_type') === 'own') {
			setValue('vehicle_uuid', null);
			setValue('name', '');
			setValue('delivery_cost', 0);
			setValue('is_hand_delivery', false);
		} else if (watch('delivery_type') === 'hand') {
			setValue('vehicle_uuid', null);
			setValue('is_own', false);
		} else {
			setValue('name', '');
			setValue('delivery_cost', 0);
		}
	}, [watch('delivery_type'), setValue]);

	const handlePackingListRemove = (
		packing_list_uuid,
		packing_list_name,
		challan_uuid
	) => {
		setDeleteItem({
			itemId: packing_list_uuid,
			itemName: packing_list_name,
			challan_uuid: challan_uuid,
		});
		window['packing_list_delete'].showModal();
	};

	return (
		<div className='flex flex-col gap-4'>
			<SectionEntryBody
				title={`${isUpdate ? `Update Challan: ${getValues('challan_number')}` : 'New Challan Entry'}`}
				header={
					<div className='flex w-full gap-1 text-sm md:w-fit'>
						<div className='w-34 my-2'>
							<FormField
								label='delivery_type'
								title='Delivery Type'
								is_title_needed='false'
								errors={errors}>
								<Controller
									name={'delivery_type'}
									control={control}
									render={({ field: { onChange } }) => {
										return (
											<ReactSelect
												placeholder='Select Delivery'
												options={types}
												value={types?.filter(
													(item) =>
														item.value ==
														getValues(
															'delivery_type'
														)
												)}
												onChange={(e) => {
													onChange(e.value);
													reset({
														...CHALLAN_NULL,
														order_type: e.value,
													});
												}}
											/>
										);
									}}
								/>
							</FormField>
						</div>
					</div>
				}>
				<div className='grid grid-cols-1 gap-4 text-secondary-content sm:grid-cols-2 md:grid-cols-3'>
					<FormField
						label='item_for'
						title='Item For'
						errors={errors}>
						<Controller
							name={'item_for'}
							control={control}
							render={({ field: { onChange } }) => (
								<ReactSelect
									placeholder='Select Item'
									options={itemOptions}
									value={itemOptions?.find(
										(item) =>
											item.value === getValues('item_for')
									)}
									onChange={(e) => {
										onChange(e.value);
									}}
									isDisabled={isUpdate}
								/>
							)}
						/>
					</FormField>
					<FormField
						label='order_info_uuid'
						title='Order Number'
						errors={errors}>
						<Controller
							name='order_info_uuid'
							control={control}
							render={({ field: { onChange } }) => {
								return (
									<ReactSelect
										placeholder='Select Order Number'
										options={orders}
										value={orders?.filter(
											(item) =>
												item.value ===
												getValues('order_info_uuid')
										)}
										onChange={(e) => onChange(e.value)}
										isDisabled={isUpdate}
									/>
								);
							}}
						/>
					</FormField>
					{!isUpdate && (
						<FormField
							label='packing_list_uuids'
							title='Packing List Number'
							errors={errors}>
							<Controller
								name='packing_list_uuids'
								control={control}
								render={({ field: { onChange } }) => {
									return (
										<ReactSelect
											isDisabled={isUpdate}
											isMulti
											placeholder='Select Packing List Number'
											options={
												isUpdate
													? packingList?.filter(
															(item) =>
																getValues(
																	'packing_list_uuids'
																).includes(
																	item.value
																)
														)
													: packingList
											}
											value={packingList?.filter(
												(item) => {
													const packing_list_uuids =
														getValues(
															'packing_list_uuids'
														);

													if (
														packing_list_uuids ===
														null
													) {
														return false;
													} else {
														if (
															isJSON(
																packing_list_uuids
															)
														) {
															return JSON.parse(
																packing_list_uuids
															)
																.split(',')
																?.includes(
																	item.value
																);
														} else {
															if (
																!Array.isArray(
																	packing_list_uuids
																)
															) {
																return packing_list_uuids?.includes(
																	item.value
																);
															}
															return packing_list_uuids?.includes(
																item.value
															);
														}
													}
												}
											)}
											onChange={(e) => {
												onChange(
													e.map(({ value }) => value)
												);
											}}
										/>
									);
								}}
							/>
						</FormField>
					)}
					{isUpdate && (
						<div className='flex flex-col gap-1'>
							<p className='text-sm font-semibold text-secondary'>
								Packing List Number
							</p>
							<div className='flex h-full flex-wrap items-center gap-2 rounded-md border border-secondary/30 p-2'>
								{packingList
									?.filter((item) =>
										getValues(
											'packing_list_uuids'
										).includes(item.value)
									)
									.map((item) => (
										<button
											key={item.value}
											onClick={() => {
												handlePackingListRemove(
													item.value,
													item.label,
													null
												);
												invalidatePackingList();
											}}
											disabled={
												getValues('packing_list_uuids')
													.length < 2
											}
											type={'button'}
											className='btn btn-outline btn-error btn-sm'>
											{item.label}
											<Trash2 className='size-4' />
										</button>
									))}
							</div>
						</div>
					)}

					{isUpdate && (
						<FormField
							label='new_packing_list_uuids'
							title='New Packing List Number'
							errors={errors}>
							<Controller
								name='new_packing_list_uuids'
								control={control}
								render={({ field: { onChange } }) => {
									const val = packingList?.filter((item) => {
										const new_packing_list_uuids =
											getValues('new_packing_list_uuids');

										if (new_packing_list_uuids === null) {
											return false;
										}
										if (isJSON(new_packing_list_uuids)) {
											return JSON.parse(
												new_packing_list_uuids
											)
												.split(',')
												?.includes(item.value);
										}
										if (
											!Array.isArray(
												new_packing_list_uuids
											)
										) {
											return new_packing_list_uuids?.includes(
												item.value
											);
										}

										return new_packing_list_uuids?.includes(
											item.value
										);
									});
									return (
										<ReactSelect
											isMulti
											placeholder='Select Packing List Number'
											options={packingList?.filter(
												(item) =>
													!getValues(
														'packing_list_uuids'
													).includes(item.value)
											)}
											value={val}
											onChange={(e) => {
												onChange(
													e.map(({ value }) => value)
												);
											}}
										/>
									);
								}}
							/>
						</FormField>
					)}
					{watch('delivery_type') === 'normal' && (
						<FormField
							label='vehicle_uuid'
							title='Assign To'
							errors={errors}>
							<Controller
								name='vehicle_uuid'
								control={control}
								render={({ field: { onChange } }) => (
									<ReactSelect
										placeholder='Select Vehicle'
										options={vehicles}
										value={vehicles?.find(
											(item) =>
												item.value ===
												getValues('vehicle_uuid')
										)}
										onChange={(e) => onChange(e.value)}
									/>
								)}
							/>
						</FormField>
					)}
					{watch('delivery_type') === 'hand' && (
						<Input
							label='name'
							title='Name'
							{...{ register, errors }}
						/>
					)}
					{watch('delivery_type') === 'hand' && (
						<Input
							label='delivery_cost'
							title='Delivery Cost'
							{...{ register, errors }}
						/>
					)}

					<DateInput
						title='Delivery Date'
						label='delivery_date'
						// startDate={GetDateTime()}
						Controller={Controller}
						control={control}
						selected={watch('delivery_date')}
						{...{ register, errors }}
					/>
					<Textarea label='remarks' {...{ register, errors }} />
				</div>
			</SectionEntryBody>
		</div>
	);
}
