import { useOtherHRUserByDesignation, useThreadOrder } from '@/state/Other';

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
	const { data: users } = useOtherHRUserByDesignation('driver');
	const { data: orders } = useThreadOrder();

	return (
		<div className='flex flex-col gap-4'>
			<SectionEntryBody
				title='Challan Information'
				header={
					<div className='flex w-full gap-1 text-sm md:w-fit'>
						<div className='rounded-md bg-secondary px-1'>
							<CheckBox
								text='text-secondary-content'
								label='received'
								title='Receive Status'
								{...{ register, errors }}
								// checked={Boolean(watch('receive_status'))}
								onChange={(e) =>
									setValue('received', e.target.checked)
								}
							/>
						</div>

						<div className='rounded-md bg-secondary px-1'>
							<CheckBox
								text='text-secondary-content'
								label='gate_pass'
								title='Gate Pass'
								{...{ register, errors }}
								// checked={Boolean(watch('gate_pass'))}
								onChange={(e) =>
									setValue('gate_pass', e.target.checked)
								}
							/>
						</div>
					</div>
				}>
				<div className='grid grid-cols-1 gap-4 text-secondary-content sm:grid-cols-2 md:grid-cols-3'>
					<FormField
						label='assign_to'
						title='Assign To'
						errors={errors}>
						<Controller
							name='assign_to'
							control={control}
							render={({ field: { onChange } }) => {
								return (
									<ReactSelect
										placeholder='Select Assigned To'
										options={users}
										value={users?.find(
											(item) =>
												item.value ===
												getValues('assign_to')
										)}
										onChange={(e) =>
											onChange(e.value.toString())
										}
									/>
								);
							}}
						/>
					</FormField>
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
										value={orders?.find(
											(item) =>
												item.value ===
												getValues('order_info_uuid')
										)}
										onChange={(e) =>
											onChange(e.value.toString())
										}
										// isDisabled={isUpdate}
									/>
								);
							}}
						/>
					</FormField>
					<Input
						label={`carton_quantity`}
						{...{ register, errors }}
					/>
				</div>
				<Textarea label='remarks' {...{ register, errors }} />
			</SectionEntryBody>
		</div>
	);
}
