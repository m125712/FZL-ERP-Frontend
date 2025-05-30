import { useState } from 'react';
import { useGetURLData } from '@/state/Other';
import { useParams } from 'react-router';

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
	watch,
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
		{ label: 'ZS', value: 'zipper_sample' },
		{ label: 'Bulk ', value: 'bulk' },
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
	const { data: lab_dip_info_id } = useGetURLData(
		`/other/lab-dip/info/value/label`
	);

	return (
		<div className='flex flex-col gap-4'>
			<SectionEntryBody
				title={`${isUpdate ? `Update Recipe: ${getValues('recipe_id')}` : 'Recipe'}`}
			>
				<div className='flex flex-col gap-1 px-2 text-secondary-content md:flex-row'>
					<Input label={`name`} {...{ register, errors }} />
					<FormField
						label='sub_streat'
						title='Sub Streat'
						errors={errors}
					>
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
						errors={errors}
					>
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
