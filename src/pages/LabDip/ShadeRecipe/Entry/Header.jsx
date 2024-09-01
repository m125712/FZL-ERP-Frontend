import { useFetch } from '@/hooks';
import {
	CheckBox,
	FormField,
	Input,
	ReactSelect,
	SectionEntryBody,
	Select,
	Textarea,
} from '@/ui';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

export default function Header({
	register,
	errors,
	control,
	getValues,
	Controller,
	is_Status,
}) {
	const { shade_recipe_description_uuid } = useParams();

	const [isStatus, setIsStatus] = useState(
		typeof is_Status !== 'boolean' && is_Status === 1 ? true : false
	);
	const bleaching = [
		{ label: 'Bleach', value: 'bleach' },
		{ label: 'Non-Bleach', value: 'non-bleach' },
	];
	return (
		<SectionEntryBody title='Information'>
			<div className='flex flex-col items-end gap-6 px-2 text-secondary-content md:flex-row'>
				<Input label='name' {...{ register, errors }} />
				<Input label='sub_streat' {...{ register, errors }} />
				<FormField label='bleaching' title='Bleaching' errors={errors}>
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
											item.value == getValues('bleaching')
									)}
									onChange={(e) => onChange(e.value)}
								/>
							);
						}}
					/>
				</FormField>
				<Textarea label='remarks' {...{ register, errors }} />
				<div className='h-full rounded-md border border-secondary/30 px-2 py-1'>
					<CheckBox
						height='h-[2.5rem] '
						label='lab_status'
						title='Lab Status'
						className={'w-max'}
						defaultChecked={isStatus}
						{...{ register, errors }}
						onChange={(e) => setIsStatus(e.target.checked)}
					/>
				</div>
			</div>
		</SectionEntryBody>
	);
}
