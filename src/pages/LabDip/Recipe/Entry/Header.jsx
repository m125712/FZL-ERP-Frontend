import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFetch } from '@/hooks';

import { ShowToast } from '@/components/Toast';
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
	is_Approved,
	is_Status,
	isUpdate,
}) {
	const { order_number, order_description_uuid } = useParams(); // * Not sure if this is required * //
	const bleaching = [
		{ label: 'Bleach', value: 'bleach' },
		{ label: 'Non-Bleach', value: 'non-bleach' },
	];
	const subStreatOption = [
		{ label: 'TXP', value: 'txp' },
		{ label: 'SSP', value: 'ssp' },
		{ label: 'Others', value: 'others' },
	];

	// * state fro approved and status fields*//
	const [isApproved, setIsApproved] = useState(
		typeof is_Approved !== 'boolean' && is_Approved === 1 ? true : false
	);
	const [isStatus, setIsStatus] = useState(
		typeof is_Status !== 'boolean' && is_Status === 1 ? true : false
	);

	// Todo : Fetch lab_dip_info_uuid //
	const { value: lab_dip_info_id } = useFetch(
		`/other/lab-dip/info/value/label`
	);

	return (
		<div className='flex flex-col gap-4'>
			<SectionEntryBody
				title={`${isUpdate ? `Recipe: ${getValues('recipe_id')}` : 'Recipe'}`}
				header={
					<div className='m-2 flex items-center gap-1 text-sm'>
						<div className='rounded-md border border-secondary/30 bg-secondary px-1'>
							<CheckBox
								text='text-secondary-content'
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
						{/* <div className='rounded-md border border-secondary/30 bg-secondary px-1'>
							<CheckBox
								text='text-secondary-content'
								label='status'
								title='Status'
								height='h-[2.9rem]'
								defaultChecked={isStatus}
								{...{ register, errors }}
								onChange={(e) => setIsStatus(e.target.checked)}
							/>
						</div> */}
					</div>
				}>
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
					<FormField
						label='sub_streat'
						title='Sub Streat'
						errors={errors}>
						<Controller
							name={'sub_streat'}
							control={control}
							render={({ field: { onChange } }) => {
								return (
									<ReactSelect
										placeholder='Select Sub Streat'
										options={subStreatOption}
										value={subStreatOption?.find(
											(item) =>
												item.value ==
												getValues('sub_streat')
										)}
										onChange={(e) => onChange(e.value)}
									/>
								);
							}}
						/>
					</FormField>
					<FormField
						label='bleaching'
						title='Bleaching'
						errors={errors}>
						<Controller
							name={'bleaching'}
							control={control}
							render={({ field: { onChange } }) => {
								return (
									<ReactSelect
										placeholder='Select Bleaching'
										options={bleaching}
										value={bleaching?.find(
											(item) =>
												item.value ==
												getValues('bleaching')
										)}
										onChange={(e) => onChange(e.value)}
									/>
								);
							}}
						/>
					</FormField>
				</div>

				<div className='flex flex-col gap-1 px-2 text-secondary-content md:flex-row'>
					<Textarea label='remarks' {...{ register, errors }} />
				</div>
			</SectionEntryBody>
		</div>
	);
}
