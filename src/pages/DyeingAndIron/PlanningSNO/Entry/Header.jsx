import { useFetch } from '@/hooks';
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
}) {

	const week = [
		{ label: 'DP24-W32', value: 32 },
		{ label: 'DP24-W33', value: 33 },
		{ label: 'DP24-W34', value: 34 },
		{ label: 'DP24-W35', value: 35 },
	];

	return (
		<div className='flex flex-col gap-4'>
			<SectionEntryBody title='Planning'>
				<div className='flex flex-col gap-1 px-2 text-secondary-content md:flex-row'>
					{/* week */}
					<FormField label='week' title='week' errors={errors}>
						<Controller
							name={'week'}
							control={control}
							render={({ field: { onChange } }) => {
								return (
									<ReactSelect
										placeholder='Select order info uuid'
										options={week}
										value={week?.find(
											(item) =>
												item.value == getValues('week')
										)}
										onChange={(e) => onChange(e.value)}
										isDisabled={
											week == undefined
										}
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
