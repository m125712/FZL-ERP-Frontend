import {
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
}) {
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
