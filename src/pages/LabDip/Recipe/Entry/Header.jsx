import { ShowToast } from '@/components/Toast';
import { useFetch } from '@/hooks';
import {
	CheckBox,
	FormField,
	Input,
	ReactSelect,
	SectionEntryBody,
	Textarea,
} from '@/ui';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function Header({
	register,
	errors,
	control,
	getValues,
	Controller,
	is_Approved,
	is_Status,
}) {
	const { order_number, order_description_uuid } = useParams();  // * Not sure if this is required * //

	// * state fro approved and status fields*//
	const [isApproved, setIsApproved] = useState(
		typeof is_Approved !== 'boolean' && is_Approved === 1 ? true : false
	);
	const [isStatus, setIsStatus] = useState(
		typeof is_Status !== 'boolean' && is_Status === 1 ? true : false
	);

	// Todo : Fetch lab_dip_info_uuid //
	const { value: lab_dip_info_id } = useFetch(`/other/order-properties/by/item`);

	return (
		<div className='flex flex-col gap-4'>
			<SectionEntryBody title='Recipe'>
				<div className='flex flex-col gap-1 px-2 text-secondary-content md:flex-row'>
					{/* Lab dip info ID */}
					<FormField
						label='lab_dip_info_uuid'
						title='Lab dip info ID'
						errors={errors}>
						<Controller
							name={'lab_dip_info_uuid'}
							control={control}
							render={({ field: { onChange } }) => {
								return (
									<ReactSelect
										placeholder='Select lab dip info id'
										options={lab_dip_info_id}
										value={lab_dip_info_id?.find(
											(item) =>
												item.value ==
												getValues('lab_dip_info_uuid')
										)}
										onChange={(e) => onChange(e.value)}
										isDisabled={true}
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
						<div className='rounded-md border border-primary px-1'>
							<CheckBox
								label='approved'
								title='Approved'
								height='h-[2.9rem]'
								defaultChecked={isApproved}
								{...{ register, errors }}
								onChange={(e) =>
									setIsApproved(e.target.checked)
								}
							/>
						</div>
						<div className='rounded-md border border-primary px-1'>
							<CheckBox
								label='status'
								title='Status'
								height='h-[2.9rem]'
								defaultChecked={isStatus}
								{...{ register, errors }}
								onChange={(e) => setIsStatus(e.target.checked)}
							/>
						</div>
					</div>
				</div>
			</SectionEntryBody>
		</div>
	);
}
