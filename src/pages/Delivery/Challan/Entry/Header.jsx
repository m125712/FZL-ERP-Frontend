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
		: useOtherOrder('page=challan');

	const { data: ordersThread } = isUpdate
		? useThreadOrder()
		: useThreadOrder('page=challan');

	const { data: ordersZipperSample } = isUpdate
		? useOtherOrder('is_sample=true')
		: useOtherOrder('page=challan&is_sample=true');

	const { data: ordersThreadSample } = isUpdate
		? useThreadOrder('is_sample=true')
		: useThreadOrder('page=challan&is_sample=true');

	const itemFor = watch('item_for');

	const orders =
		itemFor === 'zipper'
			? ordersZipper
			: itemFor === 'thread'
				? ordersThread
				: itemFor === 'sample_zipper'
					? ordersZipperSample
					: itemFor === 'sample_thread'
						? ordersThreadSample
						: [];

	//* Packing List Fetch
	const { data: packingList, invalidateQuery: invalidatePackingList } =
		isUpdate
			? useOtherPackingListByOrderInfoUUIDAndChallanUUID(
					watch('order_info_uuid'),
					watch('uuid')
				)
			: useOtherPackingListByOrderInfoUUID(watch('order_info_uuid'));

	const itemOptions = [
		{ label: 'Zipper', value: 'zipper' },
		{ label: 'Thread', value: 'thread' },
		{ label: 'Zipper Sample', value: 'sample_zipper' },
		{ label: 'Thread Sample', value: 'sample_thread' },
	];

	useEffect(() => {
		if (
			!isUpdate &&
			(getValues('packing_list_uuids') ||
				getValues('order_info_uuid') == null)
		) {
			setValue('packing_list_uuids', []);
			setValue('challan_entry', []);
		}
	}, [getValues('order_info_uuid'), watch('item_for')]);

	useEffect(() => {
		if (!isUpdate) {
			setValue('order_info_uuid', []);
		}
	}, [watch('item_for')]);
	const isHandDelivery = watch('is_hand_delivery');

	useEffect(() => {
		if (isHandDelivery) {
			setValue('vehicle_uuid', null);
		} else {
			setValue('name', '');
			setValue('delivery_cost', 0);
		}
	}, [isHandDelivery, setValue]);
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
						<div className='rounded-md bg-secondary px-1'>
							<CheckBox
								text='text-secondary-content'
								label='receive_status'
								title='Receive Status'
								{...{ register, errors }}
								checked={Boolean(watch('receive_status'))}
								onChange={(e) =>
									setValue('receive_status', e.target.checked)
								}
							/>
						</div>
						<div className='rounded-md bg-secondary px-1'>
							<CheckBox
								text='text-secondary-content'
								label='gate_pass'
								title='Gate Pass'
								{...{ register, errors }}
								checked={Boolean(watch('gate_pass'))}
								onChange={(e) =>
									setValue('gate_pass', e.target.checked)
								}
							/>
						</div>
						<div className='rounded-md bg-secondary px-1'>
							<CheckBox
								text='text-secondary-content'
								label='is_hand_delivery'
								title='Hand Delivery'
								{...{ register, errors }}
								checked={Boolean(watch('is_hand_delivery'))}
								onChange={(e) =>
									setValue(
										'is_hand_delivery',
										e.target.checked
									)
								}
							/>
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
									onChange={(e) => onChange(e.value)}
									isDisabled={isUpdate}
								/>
							)}
						/>
					</FormField>
					{!watch('is_hand_delivery') && (
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
					{watch('is_hand_delivery') && (
						<Input
							label='name'
							title='Name'
							{...{ register, errors }}
						/>
					)}
					{watch('is_hand_delivery') && (
						<Input
							label='delivery_cost'
							title='Delivery Cost'
							{...{ register, errors }}
						/>
					)}

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
										onChange={(e) =>
											onChange(e.value.toString())
										}
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
											value={packingList?.filter(
												(item) => {
													const new_packing_list_uuids =
														getValues(
															'new_packing_list_uuids'
														);

													if (
														new_packing_list_uuids ===
														null
													) {
														return false;
													} else {
														if (
															isJSON(
																new_packing_list_uuids
															)
														) {
															return JSON.parse(
																new_packing_list_uuids
															)
																.split(',')
																?.includes(
																	item.value
																);
														} else {
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
