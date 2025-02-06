import { useOtherSliderStockWithDescription } from '@/state/Other';

import { FormField, ReactSelect, SectionEntryBody } from '@/ui';

export default function Header({ errors, control, getValues, Controller }) {
	const { data: order } = useOtherSliderStockWithDescription();

	const section = [
		{ value: 'assembly', label: 'Assembly' },
		{ value: 'coloring', label: 'Coloring' },
	];
	return (
		<div className='flex flex-col gap-4'>
			<SectionEntryBody title='Order Description'>
				<div className='flex flex-col gap-1 px-2 text-secondary-content md:flex-row'>
					<FormField
						label='order_description_uuid'
						title='Select'
						errors={errors}
					>
						<Controller
							name={'order_description_uuid'}
							control={control}
							render={({ field: { onChange } }) => {
								return (
									<ReactSelect
										label='Status'
										className='w-full'
										placeholder='Select Order Id'
										options={order}
										value={order?.find(
											(item) =>
												item.value ==
												getValues(
													'order_description_uuid'
												)
										)}
										onChange={(e) => onChange(e.value)}
										isDisabled={false}
									/>
								);
							}}
						/>
					</FormField>

					<FormField label='section' title='Section' errors={errors}>
						<Controller
							name={'section'}
							control={control}
							render={({ field: { onChange } }) => {
								return (
									<ReactSelect
										label='Section'
										className='w-full'
										placeholder='Select section'
										options={section}
										value={section?.find(
											(item) =>
												item.value ==
												getValues('section')
										)}
										onChange={(e) => onChange(e.value)}
										isDisabled={false}
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
