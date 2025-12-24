import { useEffect } from 'react';
import { useOtherCarton, useOtherOrder, useThreadOrder } from '@/state/Other';
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
	setValue,
	isUpdate,
	watch,
}) {
	const { data: ordersZipper } = isUpdate
		? useOtherOrder('')
		: useOtherOrder('page=packing_list&item_for=full');
	const { data: ordersSlider } = isUpdate
		? useOtherOrder('')
		: useOtherOrder('page=packing_list&item_for=slider');
	const { data: ordersTape } = isUpdate
		? useOtherOrder('')
		: useOtherOrder('page=packing_list&item_for=tape');
	const { data: ordersThread } = isUpdate
		? useThreadOrder('')
		: useThreadOrder('page=packing_list&is_sample=false');
	const itemFor = {
		zipper: ordersZipper,
		thread: ordersThread,
		slider: ordersSlider,
		tape: ordersTape,
	};

	const orders = itemFor[watch('item_for')] || [];
	const { data: cartons } = useOtherCarton();
	const itemOptions = [
		{ label: 'Zipper', value: 'zipper' },
		{ label: 'Thread', value: 'thread' },
		{ label: 'Slider', value: 'slider' },
		{ label: 'Tape', value: 'tape' },
	];
	useEffect(() => {
		if (isUpdate) return;
		setValue('order_info_uuid', null);
		setValue('packing_list_entry', []);
	}, [watch('item_for')]);

	return (
		<SectionEntryBody
			title={`${isUpdate ? `Update Packing List: ${getValues('packing_number')}` : 'New Packing List Entry'}`}
		>
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
					errors={errors}
				>
					<Controller
						name={'order_info_uuid'}
						control={control}
						render={({ field: { onChange } }) => (
							<ReactSelect
								placeholder='Select Order'
								options={orders}
								value={orders?.filter(
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
					errors={errors}
				>
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
				<div className='flex items-center gap-4'>
					<CheckBox
						label='is_show_extra_information'
						title='Show Extra Information'
						{...{ register, errors }}
					/>
				</div>
				<Textarea label='remarks' {...{ register, errors }} />
			</div>
		</SectionEntryBody>
	);
}
