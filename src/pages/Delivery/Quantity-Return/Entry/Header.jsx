import { useAllZipperThreadOrderList, useOtherChallan } from '@/state/Other';

import { FormField, ReactSelect, SectionEntryBody, Textarea } from '@/ui';

export default function Header({
	Controller,
	register,
	errors,
	control,
	watch,
	getValues,

	setType,
}) {
	const { data: orders_descriptions } = useAllZipperThreadOrderList();
	const { data: challans } = useOtherChallan(
		watch('order_info_uuid') &&
			`order_info_uuid=${watch('order_info_uuid')}`
	);

	return (
		<div className='flex flex-col gap-4'>
			<SectionEntryBody title={'header'}>
				<div className='flex flex-col gap-1 px-2 text-secondary-content md:flex-row'>
					<FormField
						label='order_info_uuid'
						title='Order No.'
						errors={errors}
					>
						<Controller
							name='order_info_uuid'
							control={control}
							render={({ field: { onChange } }) => {
								return (
									<ReactSelect
										placeholder='Select Slot'
										options={orders_descriptions}
										value={orders_descriptions?.filter(
											(item) =>
												item.value ==
												getValues('order_info_uuid')
										)}
										onChange={(e) => {
											const value = e.value;
											setType(e);
											onChange(value);
										}}
									/>
								);
							}}
						/>
					</FormField>
					<FormField
						label='challan_uuid'
						title='Challan'
						errors={errors}
					>
						<Controller
							name='challan_uuid'
							control={control}
							render={({ field: { onChange } }) => {
								return (
									<ReactSelect
										placeholder='Select Slot'
										options={challans}
										value={challans?.filter(
											(item) =>
												item.value ==
												getValues('challan_uuid')
										)}
										onChange={(e) => {
											const value = e.value;
											onChange(value);
										}}
									/>
								);
							}}
						/>
					</FormField>
				</div>
			</SectionEntryBody>
		</div>
	);
}
