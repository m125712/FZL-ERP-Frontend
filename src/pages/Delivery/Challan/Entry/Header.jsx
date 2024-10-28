import { useEffect } from 'react';
import { useOtherOrder, useOtherVehicle } from '@/state/Other';
import { Controller } from 'react-hook-form';

import {
	CheckBox,
	FormField,
	Input,
	ReactSelect,
	SectionEntryBody,
	Textarea,
} from '@/ui';

export default function Header({
	register,
	errors,
	control,
	getValues,
	Controller,
	isUpdate,
	watch,
	setValue,
}) {
	const { data: vehicles } = useOtherVehicle();
	const { data: orders } = useOtherOrder();
	const isHandDelivery = watch('is_hand_delivery');

	useEffect(() => {
		if (isHandDelivery) {
			setValue('vehicle_uuid', null);
		} else {
			setValue('name', '');
			setValue('delivery_cost', 0);
		}
	}, [isHandDelivery, setValue]);
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
							render={({ field: { onChange } }) => (
								<ReactSelect
									placeholder='Select Order Number'
									options={orders}
									value={orders?.find(
										(item) =>
											item.value ===
											getValues('order_info_uuid')
									)}
									onChange={(e) =>
										onChange(e.value.toString())
									}
									isDisabled={isUpdate}
								/>
							)}
						/>
					</FormField>
					<Textarea label='remarks' {...{ register, errors }} />
				</div>
			</SectionEntryBody>
		</div>
	);
}
