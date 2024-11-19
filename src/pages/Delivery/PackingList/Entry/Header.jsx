import { useEffect } from 'react';
import { useOtherCarton, useOtherOrder, useThreadOrder } from '@/state/Other';
import { Controller } from 'react-hook-form';

import {
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
	setValue,
	isUpdate,
	watch,
}) {
	const itemOptions = [
		{ label: 'Zipper', value: 'zipper' },
		{ label: 'Thread', value: 'thread' },
	];

	const { data: ordersZipper } = useOtherOrder();
	const { data: ordersThread } = useThreadOrder();
	const itemFor = watch('item_for');

	const orders =
		itemFor === 'zipper'
			? ordersZipper
			: itemFor === 'thread'
				? ordersThread
				: [];
	const { data: cartons } = useOtherCarton();
	useEffect(() => {
		const itemFor = watch('item_for');

		if (itemFor === 'thread' && !isUpdate) {
			setValue('order_info_uuid', null);
			setValue('packing_list_entry', []);
		} else if (itemFor === 'zipper' && !isUpdate) {
			setValue('packing_list_entry', []);
			setValue('order_info_uuid', null);
		}
	}, [watch('item_for')]);
	return (
		<SectionEntryBody
			title={`${isUpdate ? `Update Packing List: ${getValues('packing_number')}` : 'New Packing List Entry'}`}>
			<div className='grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-4'>
				<FormField label='item_for' title='Item For' errors={errors}>
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

				<FormField
					label='order_info_uuid'
					title='Order No'
					errors={errors}>
					<Controller
						name={'order_info_uuid'}
						control={control}
						render={({ field: { onChange } }) => (
							<ReactSelect
								placeholder='Select Order'
								options={orders}
								value={orders?.find(
									(item) =>
										item.value ===
										getValues('order_info_uuid')
								)}
								onChange={(e) => onChange(e.value)}
								isDisabled={isUpdate}
							/>
						)}
					/>
				</FormField>

				<FormField
					label='carton_uuid'
					title='Carton Size'
					errors={errors}>
					<Controller
						name={'carton_uuid'}
						control={control}
						render={({ field: { onChange } }) => (
							<ReactSelect
								placeholder='Select Carton Size'
								options={cartons}
								value={cartons?.find(
									(item) =>
										item.value === getValues('carton_uuid')
								)}
								onChange={(e) => onChange(e.value)}
							/>
						)}
					/>
				</FormField>
				<Input
					type='number'
					label='carton_weight'
					{...{ register, errors }}
				/>
				<Textarea label='remarks' {...{ register, errors }} />
			</div>
		</SectionEntryBody>
	);
}
