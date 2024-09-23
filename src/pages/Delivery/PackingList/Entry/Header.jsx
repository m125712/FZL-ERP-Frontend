import { useOtherOrder } from '@/state/Other';
import { Controller } from 'react-hook-form';

import {
	FormField,
	Input,
	ReactSelect,
	SectionEntryBody,
	Textarea,
} from '@/ui';

export default function Header({ register, errors, control, getValues }) {
	const { data: orders } = useOtherOrder();
	return (
		<SectionEntryBody title='Packing List Information'>
			<div className='grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-4'>
				<FormField
					label='order_info_uuid'
					title='Order No'
					errors={errors}>
					<Controller
						name={'order_info_uuid'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
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
							);
						}}
					/>
				</FormField>
				<Input label='carton_size' {...{ register, errors }} />
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
