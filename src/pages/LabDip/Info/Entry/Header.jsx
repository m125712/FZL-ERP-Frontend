import { useFetch } from '@/hooks';
import {
	CheckBox,
	FormField,
	Input,
	ReactSelect,
	SectionEntryBody,
	Textarea,
} from '@/ui';
import { useState } from 'react';

export default function Header({
	register,
	errors,
	control,
	getValues,
	Controller,
	lab_status,
}) {

	// * state for lab status field *//
	const [labStatus, setLabStatus] = useState(
		typeof lab_status !== 'boolean' && Number(lab_status) === 1 ? true : false
	);
	
	const { value: order_info_uuid } = useFetch(`/other/order/info/value/label`);

	return (
		<div className='flex flex-col gap-4'>
			<SectionEntryBody title='Recipe'>
				<div className='flex flex-col gap-1 px-2 text-secondary-content md:flex-row'>
					{/* Order info ID */}
					<FormField
						label='order_info_uuid'
						title='order info'
						errors={errors}>
						<Controller
							name={'order_info_uuid'}
							control={control}
							render={({ field: { onChange } }) => {
								return (
									<ReactSelect
										placeholder='Select order info uuid'
										options={order_info_uuid}
										value={order_info_uuid?.find(
											(item) =>
												item.value ==
												getValues('order_info_uuid')
										)}
										onChange={(e) => onChange(e.value)}
										isDisabled={order_info_uuid == undefined}
									/>
								);
							}}
						/>
					</FormField>
					<Input label={`name`} {...{ register, errors }} />
				</div>

				<div className='flex flex-col gap-1 px-2 text-secondary-content md:flex-row'>
					<Textarea label='remarks' {...{ register, errors }} />
					<div className='mt-6 flex items-center gap-1 text-sm'>
						<div className='rounded-md border border-primary px-1 w-32'>
							<CheckBox
								label='lab_status'
								title='Status'
								height='h-[2.9rem]'
								defaultChecked={labStatus}
								onChange={(e) => setLabStatus(e.target.checked)}
								{...{ register, errors }}
							/>
							
						</div>
					</div>
				</div>
			</SectionEntryBody>
		</div>
	);
}
