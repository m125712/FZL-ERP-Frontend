import { SectionEntryBody, FormField, ReactSelect } from '@/ui';
import { useFetch } from '@/hooks';

export default function Header({
	register,
	errors,
	control,
	getValues,
	Controller,
}) {
	const {value: order} = useFetch('/other/slider/stock-with-order-description/value/label');
	const states = [
		{
			label: 'Open',
			value: 'Open',
		},
		{
			label: 'Closed',
			value: 'Closed',
		},
	];
	return (
		<div className='flex flex-col gap-4'>
			<SectionEntryBody title='Order Description'>
				<div className='flex flex-col gap-1 px-2 text-secondary-content md:flex-row'>
					<FormField
						label='order_description_uuid'
						title='Select'
						errors={errors}>
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
												getValues('order_description_uuid')
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
