import { useAllZipperThreadOrderList } from '@/state/Other';

import { FormField, ReactSelect, SectionEntryBody, Textarea } from '@/ui';

export default function Header({
	Controller,
	register,
	errors,
	control,

	getValues,

	setType,
}) {
	const { data: orders_descriptions } = useAllZipperThreadOrderList(
		'is_description_needed=true'
	);

	return (
		<div className='flex flex-col gap-4'>
			<SectionEntryBody title={'header'}>
				<div className='flex flex-col gap-1 px-2 text-secondary-content md:flex-row'>
					<FormField
						label='order_description_uuid'
						title='Order Description'
						errors={errors}
					>
						<Controller
							name='order_description_uuid'
							control={control}
							render={({ field: { onChange } }) => {
								return (
									<ReactSelect
										placeholder='Select Slot'
										options={orders_descriptions}
										value={orders_descriptions?.filter(
											(item) =>
												item.value ==
												getValues(
													'order_description_uuid'
												)
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
					<Textarea label='remarks' {...{ register, errors }} />
				</div>
			</SectionEntryBody>
		</div>
	);
}
