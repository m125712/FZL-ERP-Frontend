import { useOtherCarton, useOtherOrder } from '@/state/Other';
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
	isUpdate,
}) {
	const { data: orders } = useOtherOrder();
	const { data: cartons } = useOtherCarton();

	return (
		<SectionEntryBody
			title={`${isUpdate ? `Update Packing List: ${getValues('packing_number')}` : 'New Packing List Entry'}`}>
			<div className='grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-4'>
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
